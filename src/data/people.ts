export interface Person {
  name: string
  locationName: string
  lat: number
  lng: number
  emoji: string
  funLabel: string
}

export const PEOPLE: Person[] = [
  { name: 'Anastasia', locationName: 'Greyton',        lat: -34.0382, lng: 19.6102, emoji: '🎬🏡', funLabel: 'Taking the best videos of Greyton' },
  { name: 'Andre',     locationName: 'Paarl',          lat: -33.7312, lng: 18.9706, emoji: '🏉💪', funLabel: 'Practicing his passes' },
  { name: 'Andrea',    locationName: 'Rondebosch',     lat: -33.9570, lng: 18.4780, emoji: '👶❤️', funLabel: 'Looking after Jack' },
  { name: 'Angus',     locationName: 'Rondebosch',     lat: -33.9610, lng: 18.4740, emoji: '💇✂️', funLabel: 'Getting a fresh haircut' },
  { name: 'Chris',     locationName: 'Greyton',        lat: -34.0410, lng: 19.6050, emoji: '🎭🔫', funLabel: 'Loving Mafia!' },
  { name: 'Daniel',    locationName: 'Stellenbosch',   lat: -33.9321, lng: 18.8602, emoji: '🏓🔥', funLabel: 'Smashing padel balls' },
  { name: 'Dormehl',   locationName: 'Sea Point',      lat: -33.9180, lng: 18.3850, emoji: '🧘🏋️', funLabel: 'Practicing Pilates and gyming' },
  { name: 'Francois',  locationName: 'Foreshore',      lat: -33.9170, lng: 18.4260, emoji: '🦾🏆', funLabel: 'Hyrox man' },
  { name: 'James',     locationName: 'In the sea',     lat: -34.1500, lng: 18.7000, emoji: '🐟🎣', funLabel: 'The tuna specialist' },
  { name: 'Jenna',     locationName: 'Somerset West',  lat: -34.0825, lng: 18.8430, emoji: '🥾⛰️', funLabel: 'Hiker' },
  { name: 'Lloyd',     locationName: 'Simonstown',     lat: -34.1908, lng: 18.4326, emoji: '💍🐧', funLabel: 'Penguin town romantic' },
  { name: 'Luc',       locationName: 'Sea Point',      lat: -33.9210, lng: 18.3810, emoji: '🏓🌊', funLabel: 'Padel by the sea' },
  { name: 'Lungile',   locationName: 'Rondebosch',     lat: -33.9550, lng: 18.4690, emoji: '😂🤪', funLabel: 'Life of the party' },
  { name: 'Michael',   locationName: 'Greyton',        lat: -34.0350, lng: 19.6130, emoji: '♟️🧠', funLabel: 'Chess strategist' },
  { name: 'Natalia',   locationName: 'Hermanus',       lat: -34.4187, lng: 19.2345, emoji: '🐋👀', funLabel: 'Whale watching' },
  { name: 'Nic',       locationName: 'Rondebosch',     lat: -33.9520, lng: 18.4710, emoji: '⭐👶👑', funLabel: 'Baby leader' },
  { name: 'Oliver',    locationName: 'Greyton',        lat: -34.0430, lng: 19.6080, emoji: '🔍🕵️', funLabel: 'Murder mystery master' },
  { name: 'Rosie',     locationName: 'Rondebosch',     lat: -33.9590, lng: 18.4790, emoji: '🎨🎭', funLabel: 'Art, museums and theatre' },
]
