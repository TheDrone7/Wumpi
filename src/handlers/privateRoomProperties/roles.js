const Roles = {
  owner: [
    "MANAGE_WEBHOOKS",
    "READ_MESSAGES",
    "SEND_MESSAGES",
    "MANAGE_MESSAGES",
    "MENTION_EVERYONE",
    "USE_EXTERNAL_EMOJIS"
  ],
  admin: [
    "READ_MESSAGES",
    "SEND_MESSAGES",
    "MANAGE_MESSAGES",
    "MENTION_EVERYONE",
    "USE_EXTERNAL_EMOJIS"
  ],
  writer: [
    "READ_MESSAGES",
    "SEND_MESSAGES",
    "ADD_REACTIONS",
    "USE_EXTERNAL_EMOJIS"
  ],
  reader: [
    "READ_MESSAGES"
  ]
}

module.exports = { Roles };