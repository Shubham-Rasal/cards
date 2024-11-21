'use client'

import { Badge } from "@/components/ui/badge"
import { Cloud, Users, Zap, TrendingUp, Shield, Star, StarHalf } from 'lucide-react'

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
  description = "A cloud-native SaaS solution",
  url = "https://example.com",
  rank = "A",
  attackPower = 5,
  defencePower = 5,
  hiddenAdvantage = "Has the power to make developers smile!"
}: SaasCardProps) {
  return (
    <div className="card-body h-[470px] w-[320px] border-2 border-emerald-500/20 rounded-xl relative bg-[#2c2c2c] text-emerald-50 shadow-xl shadow-emerald-200/20 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-500/5 pointer-events-none" />
      <div className="relative z-10 p-2 space-y-4">
        <div className="relative w-full h-48 mx-auto overflow-hidden rounded-lg border border-emerald-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-emerald-500/20" />
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover relative z-10"
          />
        </div>
        <div className="text-center space-y-1">
          <div className="">
            <h2 className="text-2xl font-bold tracking-tight text-emerald-300">
              <span className="text-emerald-500">{name}</span>
            </h2>

          <p className="text-sm text-emerald-400/80">{description}</p>
          </div>
          <div className="mt-2 p-2 bg-emerald-950/50 rounded-tr-lg rounded-br-lg border border-emerald-500/20">
            <p className="text-sm italic text-emerald-300">✨ {hiddenAdvantage}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">Attack Power</span>
              </div>
              <div className="w-32 h-2 bg-emerald-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500" 
                  style={{ width: `${(attackPower / 10) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">Defence Power</span>
              </div>
              <div className="w-32 h-2 bg-emerald-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500" 
                  style={{ width: `${(defencePower / 10) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">Rank</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-sm ${rank === 'S' ? 'text-emerald-500' : 'text-emerald-400/80'}`}>S</span>
                <span className={`text-sm ${rank === 'A' ? 'text-emerald-500' : 'text-emerald-400/80'}`}>A</span>
                <span className={`text-sm ${rank === 'B' ? 'text-emerald-500' : 'text-emerald-400/80'}`}>B</span>
                <span className={`text-sm ${rank === 'C' ? 'text-emerald-500' : 'text-emerald-400/80'}`}>C</span>
                <span className={`text-sm ${rank === 'D' ? 'text-emerald-500' : 'text-emerald-400/80'}`}>D</span>
                <span className={`text-sm ${rank === 'E' ? 'text-emerald-500' : 'text-emerald-400/80'}`}>E</span>
                <span className={`text-sm ${rank === 'F' ? 'text-emerald-500' : 'text-emerald-400/80'}`}>F</span>
              </div>
            </div>

          </div>
         
        </div>
      </div>
      <div className="border-t border-emerald-500/20 bg-emerald-950/30 p-2 flex justify-between items-center">
        <div className="text-sm text-emerald-400/80">Overall Rating</div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-emerald-300 fill-emerald-500 " />     
            <Star className="w-4 h-4 text-emerald-300 fill-emerald-500 " />
            <Star className="w-4 h-4 text-emerald-300 fill-emerald-500 " />
            <Star className="w-4 h-4 text-emerald-300 fill-emerald-500 " />
            <StarHalf className="w-4 h-4 text-emerald-300  "/>
          </div>
        </div>
      </div>
    </div>
  )
}