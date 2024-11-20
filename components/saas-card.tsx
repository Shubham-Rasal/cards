'use client'

import { Badge } from "@/components/ui/badge"
import { Cloud, Users, Zap, TrendingUp, Shield, Star, StarHalf } from 'lucide-react'
import { generateColorScheme } from "@/lib/utils"

interface SaasCardProps {
  name?: string
  imageUrl?: string
  description?: string
  url?: string
  rank?: string
  attackPower?: number
  defencePower?: number
  hiddenAdvantage?: string
}

export function SaasCard({ 
  name = "example.com", 
  imageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/132.svg",
  url = "https://example.com",
  rank = "A",
  attackPower = 5,
  defencePower = 5,
  hiddenAdvantage = "Has the power to make developers smile!"
}: SaasCardProps) {
  const colors = generateColorScheme(url);

  return (
    <div className="card-body max-h-[550px] w-full border-2 rounded-xl relative overflow-hidden z-0"
         style={{ 
           borderColor: `${colors.primary}20`,
           backgroundColor: colors.bg,
           color: colors.text
         }}>
      <div className="absolute inset-0 pointer-events-none" 
           style={{ 
             background: `linear-gradient(135deg, ${colors.primary}10 0%, transparent 50%, ${colors.primary}05 100%)`
           }} />
      <div className="relative z-10 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 px-2 py-1 rounded-md"
               style={{ 
                 backgroundColor: `${colors.darker}80`,
                 color: colors.light,
                 borderColor: `${colors.primary}50`
               }}>
            <Shield className="w-4 h-4" />
            <span>{defencePower}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-md"
               style={{ 
                 backgroundColor: `${colors.darker}80`,
                 color: colors.light,
                 borderColor: `${colors.primary}50`
               }}>
            <TrendingUp className="w-4 h-4" />
            <span>{attackPower}</span>
          </div>
        </div>
        <div className="relative w-full h-48 mx-auto overflow-hidden rounded-lg border"
             style={{ borderColor: `${colors.primary}20` }}>
          <div className="absolute inset-0" 
               style={{ 
                 background: `linear-gradient(135deg, ${colors.primary}20 0%, transparent 50%, ${colors.primary}20 100%)`
               }} />
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover relative z-10"
          />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 z-20 px-2 py-1 rounded text-xs transition-colors"
            style={{ 
              backgroundColor: `${colors.darker}CC`,
              color: colors.light,
              borderColor: `${colors.primary}50`
            }}
          >
            Visit Site
          </a>
        </div>
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: colors.light }}>{name}</h2>
            <Badge variant="outline" className="text-lg font-bold" style={{ borderColor: colors.primary, color: colors.light }}>
              {rank}
            </Badge>
          </div>
          <div className="mt-2 p-2 rounded-lg border"
               style={{ 
                 backgroundColor: `${colors.darker}80`,
                 borderColor: `${colors.primary}20`
               }}>
            <p className="text-sm italic" style={{ color: colors.light }}>✨ {hiddenAdvantage}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4" style={{ color: colors.light }} />
                <span className="text-sm">Attack Power</span>
              </div>
              <div className="w-32 h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.darker }}>
                <div 
                  className="h-full"
                  style={{ 
                    width: `${(attackPower / 10) * 100}%`,
                    backgroundColor: colors.primary
                  }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" style={{ color: colors.light }} />
                <span className="text-sm">Defence Power</span>
              </div>
              <div className="w-32 h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.darker }}>
                <div 
                  className="h-full"
                  style={{ 
                    width: `${(defencePower / 10) * 100}%`,
                    backgroundColor: colors.primary
                  }}
                />
              </div>
            </div>
          </div>
         
        </div>
      </div>
      <div className="border-t p-4 flex justify-between items-center"
           style={{ 
             borderColor: `${colors.primary}20`,
             backgroundColor: `${colors.darker}30`
           }}>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4" style={{ color: colors.light, fill: colors.primary }} />
            <Star className="w-4 h-4" style={{ color: colors.light, fill: colors.primary }} />
            <Star className="w-4 h-4" style={{ color: colors.light, fill: colors.primary }} />
            <Star className="w-4 h-4" style={{ color: colors.light, fill: colors.primary }} />
            <StarHalf className="w-4 h-4" style={{ color: colors.light }}/>
          </div>
        </div>
      </div>
    </div>
  )
}