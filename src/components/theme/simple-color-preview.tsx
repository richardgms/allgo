"use client"

interface SimpleColorPreviewProps {
  color: string
}

export default function SimpleColorPreview({ color }: SimpleColorPreviewProps) {
  // Gerar tons simples baseados na cor
  const generateShades = (baseColor: string) => {
    // Para o MVP, vamos mostrar apenas algumas variações básicas
    return [
      { shade: '100', color: baseColor + '20' }, // Mais claro (com opacidade)
      { shade: '300', color: baseColor + '60' }, 
      { shade: '500', color: baseColor }, // Cor base
      { shade: '700', color: baseColor + 'CC' }, 
      { shade: '900', color: baseColor + '80' }, // Mais escuro
    ]
  }

  const shades = generateShades(color)

  return (
    <div className="flex gap-1 mt-2">
      {shades.map(({ shade, color: shadeColor }) => (
        <div
          key={shade}
          className="w-8 h-8 rounded border border-border"
          style={{ backgroundColor: shadeColor }}
          title={`${shade}: ${shadeColor}`}
        />
      ))}
    </div>
  )
}