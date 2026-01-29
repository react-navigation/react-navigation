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

    invalidate()
  }

  fun setVariant(variant: String) {
    if (this.variant == variant) {
      return
    }

    this.variant = variant

    updateTypeface()
  }

  fun setWeight(weight: Int) {
    if (this.weight == weight) {
      return
    }

    this.weight = weight

    updateTypeface()
  }

  private fun updateTypeface() {
    setTypeface(
      MaterialSymbolTypeface.get(
        context,
        variant?.ifEmpty { null },
        weight.takeIf { it != 0 }).typeface
    )

    invalidate()
  }

  fun setColor(color: Int) {
    setTextColor(color)
  }

  fun setSize(size: Float) {
    textSize = size
  }
}
