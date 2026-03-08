package org.reactnavigation

import android.content.Context
import android.graphics.Typeface

data class MaterialSymbolTypefaceResult(val typeface: Typeface, val suffix: String)

object MaterialSymbolTypeface {
  private val typefaces = mutableMapOf<String, Typeface>()
  private var availableFonts: Map<String, Set<Int>>? = null

  fun get(context: Context, variant: String?, weight: Int?): MaterialSymbolTypefaceResult {
    val fonts = getAvailableFonts(context)

    val resolvedVariant = if (variant != null) {
      when (variant) {
        "rounded" -> "Rounded"
        "sharp" -> "Sharp"
        else -> "Outlined"
      }
    } else {
      resolveDefaultVariant(fonts)
    }

    val resolvedWeight = weight ?: resolveDefaultWeight(fonts, resolvedVariant)

    val suffix = "${resolvedVariant}_$resolvedWeight"

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

  private fun getAvailableFonts(context: Context): Map<String, Set<Int>> {
    availableFonts?.let { return it }

    val files = context.assets.list("fonts")
      ?.filter { it.startsWith("MaterialSymbols") && it.endsWith(".ttf") } ?: emptyList()

    if (files.isEmpty()) {
      throw RuntimeException("No MaterialSymbols font found in assets.")
    }

    val fonts = mutableMapOf<String, MutableSet<Int>>()

    for (file in files) {
      val suffix = file.removePrefix("MaterialSymbols").removeSuffix(".ttf")
      val variant = suffix.substringBefore("_")
      val weight = suffix.substringAfter("_").toIntOrNull() ?: continue

      fonts.getOrPut(variant) { mutableSetOf() }.add(weight)
    }

    availableFonts = fonts

    return fonts
  }

  private fun resolveDefaultVariant(fonts: Map<String, Set<Int>>): String {
    val variants = fonts.keys

    if (variants.size == 1) {
      return variants.first()
    }

    if (variants.contains("Outlined")) {
      return "Outlined"
    }

    throw RuntimeException(
      "Multiple MaterialSymbols variants found: ${variants.joinToString()}. " + "Please specify a variant explicitly."
    )
  }

  private fun resolveDefaultWeight(fonts: Map<String, Set<Int>>, variant: String): Int {
    val weights = fonts[variant]

    if (weights.isNullOrEmpty()) {
      throw RuntimeException("No MaterialSymbols font found for variant: $variant")
    }

    if (weights.size == 1) {
      return weights.first()
    }

    if (weights.contains(400)) {
      return 400
    }

    throw RuntimeException(
      "Multiple MaterialSymbols weights found for variant $variant: ${weights.joinToString()}. " + "Please specify a weight explicitly."
    )
  }
}
