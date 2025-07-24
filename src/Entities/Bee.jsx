{
  "name": "Bee",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Name of the bee"
    },
    "rarity": {
      "type": "string",
      "enum": [
        "Basic",
        "Rare",
        "Epic",
        "Legendary",
        "Mythic",
        "Event"
      ],
      "description": "Rarity tier of the bee"
    },
    "base_attack": {
      "type": "number",
      "description": "Base attack damage"
    },
    "base_gather_amount": {
      "type": "number",
      "description": "Base pollen gathering amount"
    },
    "base_gather_speed": {
      "type": "number",
      "description": "Base gathering speed multiplier"
    },
    "base_convert_amount": {
      "type": "number",
      "description": "Base honey conversion amount"
    },
    "base_convert_speed": {
      "type": "number",
      "description": "Base conversion speed multiplier"
    },
    "energy": {
      "type": "number",
      "description": "Energy stat"
    },
    "abilities": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of bee abilities"
    },
    "favorite_field": {
      "type": "string",
      "description": "Field where this bee performs best"
    },
    "color": {
      "type": "string",
      "description": "Bee color for pollen bonuses"
    },
    "description": {
      "type": "string",
      "description": "Description of the bee"
    },
    "image_url": {
      "type": "string",
      "description": "URL to bee image"
    }
  },
  "required": [
    "name",
    "rarity"
  ]
}