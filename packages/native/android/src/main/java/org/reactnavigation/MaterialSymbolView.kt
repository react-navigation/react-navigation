package org.reactnavigation

import android.content.Context
import android.graphics.Canvas
import android.graphics.Paint
import android.util.AttributeSet

class MaterialSymbolView @JvmOverloads constructor(
  context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : androidx.appcompat.widget.AppCompatTextView(context, attrs, defStyleAttr) {

  private var variant: String? = null
  private var weight: Int? = null

  init {
    updateTypeface()
  }

  override fun onDraw(canvas: Canvas) {
    val text = text?.toString() ?: return

    paint.color = currentTextColor
    paint.textAlign = Paint.Align.CENTER

    val fontMetrics = paint.fontMetrics
    val x = width / 2f
    val y = (height - (fontMetrics.descent - fontMetrics.ascent)) / 2f - fontMetrics.ascent

    canvas.drawText(text, x, y, paint)
  }

  fun setName(name: String) {
    text = name
  }

  fun setVariant(variant: String) {
    val resolvedVariant = variant.ifEmpty { null }

    if (this.variant == resolvedVariant) {
      return
    }

    this.variant = resolvedVariant
    updateTypeface()
  }

  fun setWeight(weight: Int) {
    val resolvedWeight = weight.takeIf { it != 0 }

    if (this.weight == resolvedWeight) {
      return
    }

    this.weight = resolvedWeight
    updateTypeface()
  }

  private fun updateTypeface() {
    setTypeface(MaterialSymbolTypeface.get(context, variant, weight).typeface)
    invalidate()
  }

  fun setColor(color: Int) {
    setTextColor(color)
  }

  fun setSize(size: Float) {
    textSize = size
  }
}
