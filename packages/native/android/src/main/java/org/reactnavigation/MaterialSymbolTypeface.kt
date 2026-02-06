package org.reactnavigation

import android.content.Context
import android.graphics.Typeface

data class MaterialSymbolTypefaceResult(val typeface: Typeface, val suffix: String)

object MaterialSymbolTypeface {
  private val typefaces = mutableMapOf<String, Typeface>()
  private var defaultSuffix: String? = null

  fun get(context: Context, variant: String?, weight: Int?): MaterialSymbolTypefaceResult {
    val suffix = if (variant != null && weight != null) {
      val resolvedVariant = when (variant) {
        "rounded" -> "Rounded"
        "sharp" -> "Sharp"
        else -> "Outlined"
      }

      "${resolvedVariant}_$weight"
    } else {
      getDefaultSuffix(context)
    }

    val typeface = typefaces.getOrPut(suffix) {
      val path = "fonts/MaterialSymbols${suffix}.ttf"

      try {
        Typeface.createFromAsset(context.assets, path)
      } catch (e: Exception) {
        throw RuntimeException("$path not found.", e)
      }
    }

    return MaterialSymbolTypefaceResult(typeface, suffix)
  }

  private fun getDefaultSuffix(context: Context): String {
    defaultSuffix?.let { return it }

    val fonts = context.assets.list("fonts")
      ?.filter { it.startsWith("MaterialSymbols") && it.endsWith(".ttf") } ?: emptyList()

    if (fonts.isEmpty()) {
      throw RuntimeException("No MaterialSymbols font found in assets.")
    }

    if (fonts.size > 1) {
      val outlinedFonts = fonts.filter { it.startsWith("MaterialSymbolsOutlined") }
      val outlinedFont = when {
        outlinedFonts.isEmpty() -> null
        outlinedFonts.size == 1 -> outlinedFonts[0]
        else -> outlinedFonts.firstOrNull {
          it.removePrefix("MaterialSymbols").removeSuffix(".ttf") == "Outlined_400"
        }
      }

      if (outlinedFont == null) {
        throw RuntimeException(
          "Multiple MaterialSymbols fonts found in assets: ${fonts.joinToString()}. " + "Please specify a variant and weight explicitly."
        )
      }

      val outlinedSuffix = outlinedFont.removePrefix("MaterialSymbols").removeSuffix(".ttf")

      defaultSuffix = outlinedSuffix

      return outlinedSuffix
    }

    val suffix = fonts[0].removePrefix("MaterialSymbols").removeSuffix(".ttf")

    defaultSuffix = suffix

    return suffix
  }
}
