{
  "name": "Beequip",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Name of the beequip"
    },
    "type": {
      "type": "string",
      "enum": [
        "Stinger",
        "Guard",
        "Antennae",
        "Booster",
        "Collector"
      ],
      "description": "The slot the beequip fits into"
    },
    "stats": {
      "type": "object",
      "description": "Key-value pairs of stats provided by the beequip"
    },
    "rarity": {
      "type": "string",
      "enum": [
        "Common",
        "Rare",
        "Epic",
        "Legendary",
        "Mythic"
      ],
      "description": "Rarity of the beequip"
    },
    "description": {
      "type": "string",
      "description": "Description of the beequip"
    },
    "image_url": {
      "type": "string",
      "description": "URL to the beequip's image"
    }
  },
  "required": [
    "name",
    "type",
    "stats"
  ]
}