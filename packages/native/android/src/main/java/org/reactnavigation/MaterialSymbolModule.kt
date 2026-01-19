package org.reactnavigation

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Paint
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
    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
  }

  override fun getImageSource(
    name: String, variant: String, size: Double, color: ReadableMap, hash: String
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

    val cacheDir = File(
      reactApplicationContext.cacheDir, "react_navigation/material_symbols/$variant/$hash"
    )

    val cacheKey = "${name.hashCode()}_${scaledSize}_$resolvedColor"
    val cacheFile = File(cacheDir, "$cacheKey.png")

    if (cacheFile.exists()) {
      return cacheFile.toUri().toString()
    }

    scope.launch {
      cacheDir.parentFile?.listFiles { it.isDirectory && it.name != hash }
        ?.forEach { it.deleteRecursively() }
    }

    cacheDir.mkdirs()

    val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
      typeface = MaterialSymbolTypeface.get(reactApplicationContext, variant)
      textSize = scaledSize.toFloat()
      textAlign = Paint.Align.CENTER

      this.color = resolvedColor
    }

    val fontMetrics = paint.fontMetrics
    val bitmap = Bitmap.createBitmap(scaledSize, scaledSize, Bitmap.Config.ARGB_8888)

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
