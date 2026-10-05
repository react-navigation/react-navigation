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
  private var fill: Boolean? = null
  private var symbol: String? = null

  init {
    setColor(null)
  }

  override fun onDraw(canvas: Canvas) {
    val symbol = symbol ?: return

    paint.color = currentTextColor
    paint.textAlign = Paint.Align.CENTER

    val fontMetrics = paint.fontMetrics
    val x = width / 2f
    val y = (height - (fontMetrics.descent - fontMetrics.ascent)) / 2f - fontMetrics.ascent

    canvas.drawText(symbol, x, y, paint)
  }

  fun setName(name: String?) {
    text = name
    symbol = name?.let { MaterialSymbolTypeface.getSymbol(context, it) }

    invalidate()
  }

  fun setVariant(variant: String?) {
    this.variant = variant
  }

  fun setWeight(weight: Int?) {
    this.weight = weight
  }

  fun setFill(fill: Int) {
    this.fill = if (fill == -1) null else fill == 1
  }

  fun updateTypeface() {
    setTypeface(
      MaterialSymbolTypeface.get(
        context,
        variant?.ifEmpty { null },
        weight.takeIf { it != 0 },
        fill).typeface
    )

    invalidate()
  }

  fun setColor(color: Int?) {
    if (color == null) {
      val typedValue = android.util.TypedValue()

      context.theme.resolveAttribute(
        android.R.attr.colorForeground, typedValue, true
      )

      val resolvedColor = if (typedValue.resourceId != 0) {
        context.getColor(typedValue.resourceId)
      } else {
        typedValue.data
      }

      setTextColor(resolvedColor)
    } else {
      setTextColor(color)
    }

    invalidate()
  }

  fun setSize(size: Float) {
    textSize = size
  }
}
