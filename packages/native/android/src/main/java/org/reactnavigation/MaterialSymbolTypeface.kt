package org.reactnavigation

import android.content.Context
import android.graphics.Typeface

object MaterialSymbolTypeface {
  private val typefaces = mutableMapOf<String, Typeface>()

  fun get(context: Context, variant: String?): Typeface {
    return typefaces.getOrPut(variant ?: "outlined") {
      val suffix = when (variant) {
        "rounded" -> "Rounded"
        "sharp" -> "Sharp"
        else -> "Outlined"
      }

      val path = "fonts/MaterialSymbols${suffix}.ttf"

      try {
        Typeface.createFromAsset(context.assets, path)
      } catch (e: Exception) {
        throw RuntimeException("$path not found.", e)
      }
    }
  }
}
