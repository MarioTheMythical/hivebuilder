{
  "name": "HiveBuild",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Name of the hive build"
    },
    "description": {
      "type": "string",
      "description": "Description of the build strategy"
    },
    "build_data": {
      "type": "object",
      "description": "JSON object containing the hive slots and bee placements"
    },
    "total_attack": {
      "type": "number",
      "description": "Total calculated attack power"
    },
    "total_gather_rate": {
      "type": "number",
      "description": "Total pollen gathering rate"
    },
    "total_convert_rate": {
      "type": "number",
      "description": "Total honey conversion rate"
    },
    "bee_count": {
      "type": "number",
      "description": "Total number of bees in hive"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Tags for categorizing builds (e.g. 'Red', 'Blue', 'White', 'Mixed')"
    },
    "is_public": {
      "type": "boolean",
      "default": false,
      "description": "Whether this build is shared publicly"
    }
  },
  "required": [
    "name",
    "build_data"
  ]
}