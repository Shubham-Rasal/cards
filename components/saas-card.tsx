'use client'

import { Badge } from "@/components/ui/badge"
import { Cloud, Users, Zap, TrendingUp, Shield, Star, StarHalf } from 'lucide-react'
import Link from "next/link"

interface SaasCardProps {
  name?: string
  imageUrl?: string
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
  return (
    <div className="card-body h-[470px] w-[320px] border-2 border-emerald-500/20 rounded-xl relative  text-emerald-50 shadow-xl shadow-emerald-200/20 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-500/5 pointer-events-none" />
      <div className="relative z-10 p-2 space-y-2">
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

      
          </div>
          <div className="my-1 p-1 rounded-sm bg-emerald-950/50 border border-emerald-500/20">
            <p className="text-[10px] italic text-emerald-200">✨ {hiddenAdvantage}</p>
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
                <Users className="w-4 h-4 text-emerald-400" />  
                <span className="text-sm">Rank</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(6)].map((_, i) => {
                  const letter = 'SABCDEF'[i]
                  return (
                    <div
                      key={letter}
                      className={`text-sm ${rank === letter ? 'bg-emerald-500/20 rounded px-1' : ''}`}
                    >
                      {letter}
                    </div>
                  )
                })}
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

      <div className="border-t border-emerald-500/20 bg-emerald-950/30 p-2 flex justify-between items-center text-xs text-emerald-400/80 gap-2">
        Copyright   2024 <a href={url} target="_blank" className="underline">{name}</a>
      </div>
      
    </div>
  )
}