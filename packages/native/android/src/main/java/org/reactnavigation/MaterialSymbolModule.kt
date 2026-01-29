package org.reactnavigation

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Paint
import androidx.core.graphics.createBitmap
import androidx.core.net.toUri
import com.facebook.fbreact.specs.NativeMaterialSymbolModuleSpec
import com.facebook.react.bridge.ColorPropConverter
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import java.io.File
import java.io.FileOutputStream
import kotlin.math.roundToInt

class MaterialSymbolModule(reactContext: ReactApplicationContext) :
  NativeMaterialSymbolModuleSpec(reactContext) {

  companion object {
    const val NAME = NativeMaterialSymbolModuleSpec.NAME

    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
  }

  private val fontHash: String by lazy {
    reactApplicationContext.assets.open("fonts/MaterialSymbols.hash").bufferedReader().readText()
      .trim()
  }

  override fun getImageSource(
    name: String, variant: String?, weight: Double?, size: Double, color: ReadableMap
  ): String {
    val colorValue = color.getDynamic("value").let {
      when (it.type) {
        com.facebook.react.bridge.ReadableType.Number -> it.asDouble()
        com.facebook.react.bridge.ReadableType.Map -> it.asMap()
        else -> null
      }
    }

    val resolvedColor = ColorPropConverter.getColor(colorValue, reactApplicationContext)
      ?: throw IllegalArgumentException("Could not resolve color")

    val density = reactApplicationContext.resources.displayMetrics.density
    val scaledSize = (size * density).roundToInt().coerceAtLeast(1)

    val (resolvedTypeface, typefaceSuffix) = MaterialSymbolTypeface.get(
      reactApplicationContext, variant, weight?.toInt()
    )

    val cacheDir = File(
      reactApplicationContext.cacheDir,
      "react_navigation/material_symbols/$typefaceSuffix/$fontHash"
    )

    val cacheKey = "${name.hashCode()}_${scaledSize}_$resolvedColor"
    val cacheFile = File(cacheDir, "$cacheKey.png")

    if (cacheFile.exists()) {
      return cacheFile.toUri().toString()
    }

    scope.launch {
      cacheDir.parentFile?.listFiles { it.isDirectory && it.name != fontHash }
        ?.forEach { it.deleteRecursively() }
    }

    cacheDir.mkdirs()

    val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
      typeface = resolvedTypeface
      textSize = scaledSize.toFloat()
      textAlign = Paint.Align.CENTER

      this.color = resolvedColor
    }

    val fontMetrics = paint.fontMetrics
    val bitmap = createBitmap(scaledSize, scaledSize)

    try {
      val canvas = Canvas(bitmap)
      val y = (scaledSize - (fontMetrics.descent - fontMetrics.ascent)) / 2f - fontMetrics.ascent

      canvas.drawText(name, scaledSize / 2f, y, paint)

      FileOutputStream(cacheFile).use {
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)
      }
    } finally {
      bitmap.recycle()
    }

    return cacheFile.toUri().toString()
  }
}
