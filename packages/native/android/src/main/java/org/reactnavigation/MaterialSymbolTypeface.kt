package org.reactnavigation

import android.content.Context
import android.graphics.Typeface
import java.util.concurrent.ConcurrentHashMap

data class MaterialSymbolTypefaceResult(val typeface: Typeface, val suffix: String)

object MaterialSymbolTypeface {
  private const val CONFIG_HINT =
    "Configure the fonts in \"react-navigation\" > \"material-symbols\" > \"fonts\" in package.json and rebuild the app."

  private val typefaces = ConcurrentHashMap<String, Typeface>()
  private var availableFonts: Map<String, Map<Int, Set<Boolean>>>? = null
  private var symbols: Map<String, String>? = null
  private var autoMirroredSymbols: Set<String>? = null

  fun isAvailable(context: Context): Boolean {
    return getAvailableFonts(context).isNotEmpty()
  }

  fun isAutoMirrored(context: Context, name: String): Boolean {
    autoMirroredSymbols?.let { return it.contains(name) }

    val result = context.assets.open("fonts/MaterialSymbols.mirrored").bufferedReader()
      .useLines { lines -> lines.toSet() }

    autoMirroredSymbols = result

    return result.contains(name)
  }

  fun get(context: Context, variant: String?, weight: Int?, fill: Boolean?): MaterialSymbolTypefaceResult {
    val suffix = getSuffix(context, variant, weight, fill)

    val typeface = typefaces.getOrPut(suffix) {
      val path = "fonts/MaterialSymbols${suffix}.ttf"

      try {
        Typeface.createFromAsset(context.assets, path)
      } catch (e: Exception) {
        throw RuntimeException("Failed to load the Material Symbols font \"$path\".", e)
      }
    }

    return MaterialSymbolTypefaceResult(typeface, suffix)
  }

  fun getSymbol(context: Context, name: String): String? {
    symbols?.let { return it[name] }

    val result = context.assets.open("fonts/MaterialSymbols.codepoints").bufferedReader()
      .useLines { lines ->
        lines.associate { line ->
          val (key, codepoint) = line.split(" ")

          key to String(Character.toChars(codepoint.toInt(16)))
        }
      }

    symbols = result

    return result[name]
  }

  fun getSuffix(context: Context, variant: String?, weight: Int?, fill: Boolean?): String {
    val fonts = getAvailableFonts(context)

    if (fonts.isEmpty()) {
      throw RuntimeException("No Material Symbols fonts found. $CONFIG_HINT")
    }

    val resolvedVariant = if (variant != null) {
      when (variant) {
        "outlined" -> "Outlined"
        "rounded" -> "Rounded"
        "sharp" -> "Sharp"
        else -> throw IllegalArgumentException(
          "Invalid Material Symbols variant \"$variant\". Expected \"outlined\", \"rounded\" or \"sharp\"."
        )
      }
    } else {
      resolveDefaultVariant(fonts)
    }

    val variantName = "\"${resolvedVariant.lowercase()}\""

    val weights = fonts[resolvedVariant]
      ?: throw RuntimeException("No Material Symbols font found for variant $variantName. $CONFIG_HINT")

    val resolvedWeight = weight ?: resolveDefaultWeight(weights, resolvedVariant)

    val fills = weights[resolvedWeight]
      ?: throw RuntimeException(
        "No Material Symbols font found for variant $variantName and weight $resolvedWeight. $CONFIG_HINT"
      )

    val resolvedFill = fill ?: fills.singleOrNull() ?: false

    if (!fills.contains(resolvedFill)) {
      throw RuntimeException(
        "No Material Symbols font found for variant $variantName, weight $resolvedWeight and fill ${if (resolvedFill) 1 else 0}. $CONFIG_HINT"
      )
    }

    return "${resolvedVariant}_$resolvedWeight" + if (resolvedFill) "_Filled" else ""
  }

  private fun getAvailableFonts(context: Context): Map<String, Map<Int, Set<Boolean>>> {
    availableFonts?.let { return it }

    val files = context.assets.list("fonts")
      ?.filter { it.startsWith("MaterialSymbols") && it.endsWith(".ttf") } ?: emptyList()

    val fonts = mutableMapOf<String, MutableMap<Int, MutableSet<Boolean>>>()

    for (file in files) {
      val parts = file.removePrefix("MaterialSymbols").removeSuffix(".ttf").split("_")
      val variant = parts[0]
      val weight = parts.getOrNull(1)?.toIntOrNull() ?: continue
      val fill = parts.getOrNull(2) == "Filled"

      fonts.getOrPut(variant) { mutableMapOf() }.getOrPut(weight) { mutableSetOf() }.add(fill)
    }

    availableFonts = fonts

    return fonts
  }

  private fun resolveDefaultVariant(fonts: Map<String, Map<Int, Set<Boolean>>>): String {
    val variants = fonts.keys

    if (variants.size == 1) {
      return variants.first()
    }

    if (variants.contains("Outlined")) {
      return "Outlined"
    }

    throw RuntimeException(
      "Multiple Material Symbols variants found: ${variants.joinToString { "\"${it.lowercase()}\"" }}. " +
        "Specify the \"variant\" to use."
    )
  }

  private fun resolveDefaultWeight(weights: Map<Int, Set<Boolean>>, variant: String): Int {
    if (weights.size == 1) {
      return weights.keys.first()
    }

    if (weights.contains(400)) {
      return 400
    }

    throw RuntimeException(
      "Multiple Material Symbols weights found for variant \"${variant.lowercase()}\": ${weights.keys.sorted().joinToString()}. " +
        "Specify the \"weight\" to use."
    )
  }
}
