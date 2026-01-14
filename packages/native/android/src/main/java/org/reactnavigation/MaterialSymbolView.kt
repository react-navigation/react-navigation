package org.reactnavigation

import android.content.Context
import android.graphics.Canvas
import android.graphics.Paint
import android.util.AttributeSet
import android.widget.TextView

class MaterialSymbolView @JvmOverloads constructor(
  context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : TextView(context, attrs, defStyleAttr) {

  private var variant: String? = null

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
    if (this.variant == variant) {
      return
    }

    this.variant = variant

    setTypeface(MaterialSymbolTypeface.get(context, variant))
    invalidate()
  }

  fun setColor(color: Int) {
    setTextColor(color)
  }

  fun setSize(size: Float) {
    textSize = size
  }
}
