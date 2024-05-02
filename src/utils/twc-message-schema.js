/* eslint-disable max-lines */
// The file is too long because of the length of the json schema def

import { Ajv } from 'ajv';

const twcSchemaJson = `{
    "$id": "https://json-schema.teneo.ai/twc-schemas/messages",
    "type": "object",
    "properties": {
        "type": { "type": "string", "enum": [
            "image", "youtubevideo", "vimeovideo", "filevideo", "audio", 
            "buttons", "quickreply", "clickablelist", "linkbuttons", "table", 
            "card", "carousel", "combo", "rating", "text", "system", "modal", "form"] }
    },
    "required": ["type"],
    "allOf": [
        { "if": { "properties": { "type": { "type": "string", "const": "image" } } }, "then": { "$ref": "/twc-schemas/message-image" } },
        { "if": { "properties": { "type": { "type": "string", "enum": ["youtubevideo", "vimeovideo", "filevideo"] } } }, "then": { "$ref": "/twc-schemas/message-video" } },
        { "if": { "properties": { "type": { "type": "string", "const": "audio" } } }, "then": { "$ref": "/twc-schemas/message-audio" } },
        { "if": { "properties": { "type": { "type": "string", "const": "buttons" } } }, "then": { "$ref": "/twc-schemas/message-buttons" } },
        { "if": { "properties": { "type": { "type": "string", "const": "quickreply" } } }, "then": { "$ref": "/twc-schemas/message-quick-replies" } },
        { "if": { "properties": { "type": { "type": "string", "const": "clickablelist"  } } }, "then": { "$ref": "/twc-schemas/message-clickable-list" } },
        { "if": { "properties": { "type": { "type": "string", "const": "linkbuttons" } } }, "then": { "$ref": "/twc-schemas/message-link-buttons" } },
        { "if": { "properties": { "type": { "type": "string", "const": "table" } } }, "then": { "$ref": "/twc-schemas/message-table" } },
        { "if": { "properties": { "type": { "type": "string", "const": "card" } } }, "then": { "$ref": "/twc-schemas/message-card" } },
        { "if": { "properties": { "type": { "type": "string", "const": "carousel" } } }, "then": { "$ref": "/twc-schemas/message-carousel" } },
        { "if": { "properties": { "type": { "type": "string", "const": "combo" } } }, "then": { "$ref": "/twc-schemas/message-combo" } },
        { "if": { "properties": { "type": { "type": "string", "const": "rating" } } }, "then": { "$ref": "/twc-schemas/message-rating" } },
        { "if": { "properties": { "type": { "type": "string", "const": "text" } } }, "then": { "$ref": "/twc-schemas/message-text" } },
        { "if": { "properties": { "type": { "type": "string", "const": "system" } } }, "then": { "$ref": "/twc-schemas/message-system" } },
        { "if": { "properties": { "type": { "type": "string", "const": "modal" } } }, "then": { "$ref": "/twc-schemas/message-modal" } },
        { "if": { "properties": { "type": { "type": "string", "const": "form" } } }, "then": { "$ref": "/twc-schemas/message-form" } }
    ],
    "$defs": {
        "https://json-schema.teneo.ai/twc-schemas/message-image": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/message-image",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "title": "TWC Image",
            "description": "Teneo Web Chat - Image message JSON format",
            "type": "object",
            "properties": {
                "type": { "type": "string", "const": "image" },
                "image_url": { "type": "string", "format": "uri" },
                "thumbnail_url": { "type": "string", "format": "uri" },
                "alt": { "type": "string" }
            },
            "required": ["type"],
            "anyOf": [
                { "required": ["image_url"] },
                { "required": ["thumbnail_url"] }
            ],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/message-video": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/message-video",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "title": "TWC Video",
            "description": "Teneo Web Chat - Video message JSON format",
            "type": "object",
            "properties": {
                "type": { "type": "string", "enum": ["youtubevideo", "vimeovideo", "filevideo"] },
                "video_url": { "type": "string", "format": "uri" }
            },
            "required": ["type", "video_url"],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/message-audio": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/message-audio",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "title": "TWC Audio",
            "description": "Teneo Web Chat - Audio message JSON format",
            "type": "object",
            "properties": {
                "type": { "type": "string", "const": "audio" },
                "audio_url": { "type": "string", "format": "uri" }
            },
            "required": ["type", "audio_url"],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/message-buttons": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/message-buttons",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "title": "TWC Buttons",
            "description": "Teneo Web Chat - Buttons message JSON format",
            "type": "object",
            "properties": {
                "type": { "type": "string", "const": "buttons" },
                "title": { "type": "string" },
                "button_items": {
                    "type": "array",
                    "items": { "$ref": "/twc-schemas/helpers/style-postback" },
                    "minItems": 1
                }
            },
            "required": ["type", "button_items"],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/message-quick-replies": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/message-quick-replies",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "title": "TWC Quick Replies",
            "description": "Teneo Web Chat - Quick Replies message JSON format",
            "type": "object",
            "properties": {
                "type": { "type": "string", "const": "quickreply" },
                "title": { "type": "string" },
                "quick_replies": {
                    "type": "array",
                    "items": { "$ref": "/twc-schemas/helpers/style-postback" },
                    "minItems": 1
                }
            },
            "required": ["type", "quick_replies"],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/message-clickable-list": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/message-clickable-list",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "title": "TWC Clickable List",
            "description": "Teneo Web Chat - Clickable List message JSON format",
            "type": "object",
            "properties": {
                "type": { "type": "string", "const": "clickablelist" },
                "title": { "type": "string" },
                "list_items": {
                    "type": "array",
                    "items": { "$ref": "/twc-schemas/helpers/postback" },
                    "minItems": 1
                }
            },
            "required": ["type", "list_items"],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/message-link-buttons": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/message-link-buttons",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "title": "TWC Link Buttons",
            "description": "Teneo Web Chat - Link Buttons message JSON format",
            "type": "object",
            "properties": {
                "type": { "type": "string", "const": "linkbuttons" },
                "title": { "type": "string" },
                "linkbutton_items": {
                    "type": "array",
                    "items": { "$ref": "/twc-schemas/helpers/link" },
                    "minItems": 1
                }
            },
            "required": ["type", "linkbutton_items"],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/message-table": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/message-table",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "title": "TWC Table",
            "description": "Teneo Web Chat - Table message JSON format",
            "type": "object",
            "properties": {
                "type": { "type": "string", "const": "table" },
                "title": { "type": "string" },
                "headers": {
                    "type": "array",
                    "items": { "type": "string" }
                },
                "body": {
                    "type": "array",
                    "items": {
                        "type": "array",
                        "items": { "type": "string" },
                        "minItems": 1
                    },
                    "minItems": 1
                },
                "footers": {
                    "type": "array",
                    "items": { "type": "string" }
                }
            },
            "required": ["type", "body"],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/message-card": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/message-card",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "title": "TWC Card",
            "description": "Teneo Web Chat - Card message JSON format",
            "type": "object",
            "properties": {
                "type": { "type": "string", "const": "card" },
                "image": { "type": "object",
                    "properties": {
                        "image_url": { "type": "string", "format": "uri" },
                        "alt": { "type": "string" }
                } },
                "title": { "type": "string" },
                "subtitle": { "type": "string" },
                "text": { "type": "string" },
                "button_items": {
                    "type": "array",
                    "items": { "$ref": "/twc-schemas/helpers/style-postback" }
                },
                "list_items": {
                    "type": "array",
                    "items": { "$ref": "/twc-schemas/helpers/postback" }
                },
                "linkbutton_items": {
                    "type": "array",
                    "items": { "$ref": "/twc-schemas/helpers/link" }
                }
            },
            "required": ["type"],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/message-carousel": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/message-carousel",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "title": "TWC Carousel",
            "description": "Teneo Web Chat - Card Carousel message JSON format",
            "type": "object",
            "properties": {
                "type": { "type": "string", "const": "carousel" },
                "carousel_items": {
                    "type": "array",
                    "items": { "$ref": "/twc-schemas/message-card" },
                    "minItems": 1,
                    "maxItems": 10
                }
            },
            "required": ["type", "carousel_items"],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/message-combo": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/message-combo",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "title": "TWC Combo",
            "description": "Teneo Web Chat - Combo message JSON format",
            "type": "object",
            "properties": {
                "type": { "type": "string", "const": "combo" },
                "components": {
                    "type": "array",
                    "items": { "anyOf": [
                        { "$ref": "/twc-schemas/message-buttons" },
                        { "$ref": "/twc-schemas/message-card" },
                        { "$ref": "/twc-schemas/message-clickable-list" },
                        { "$ref": "/twc-schemas/message-image" },
                        { "$ref": "/twc-schemas/message-link-buttons" },
                        { "$ref": "/twc-schemas/message-quick-replies" },
                        { "$ref": "/twc-schemas/message-text" },
                        { "$ref": "/twc-schemas/message-video" },
                        { "$ref": "/twc-schemas/message-audio" },
                        { "$ref": "/twc-schemas/message-table" }
                    ] },
                    "minItems": 1
                }
            },
            "required": ["type"],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/message-rating": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/message-rating",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "title": "TWC Rating",
            "description": "Teneo Web Chat - Rating/Feedback message JSON format",
            "type": "object",
            "properties": {
                "type": { "type": "string", "const": "rating" },
                "title": { "type": "string" },
                "maxValue": { "type": "number" },
                "commentsAllowed": { "type": "boolean" }
            },
            "required": ["type", "title", "maxValue", "commentsAllowed"],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/message-text": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/message-text",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "title": "TWC Text",
            "description": "Teneo Web Chat - Text message JSON format",
            "type": "object",
            "properties": {
                "type": { "type": "string", "const": "text" },
                "text": { "type": "string" }
            },
            "required": ["type", "text"],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/message-system": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/message-system",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "title": "TWC System",
            "description": "Teneo Web Chat - System message JSON format",
            "type": "object",
            "properties": {
                "type": { "type": "string", "const": "system" },
                "text": { "type": "string" }
            },
            "required": ["type", "text"],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/message-modal": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/message-modal",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "title": "TWC Modal",
            "description": "Teneo Web Chat - Modal message JSON format",
            "type": "object",
            "properties": {
                "type": { "type": "string", "const": "modal" },
                "image": { "type": "object",
                    "properties": {
                        "image_url": { "type": "string", "format": "uri" },
                        "alt": { "type": "string" }
                } },
                "title": { "type": "string" },
                "text": { "type": "string" },
                "button_items": {
                    "type": "array",
                    "items": { "$ref": "/twc-schemas/helpers/style-postback" },
                    "minItems": 1
                }
            },
            "required": ["type"],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/message-form": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/message-form",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "title": "TWC Form",
            "description": "Teneo Web Chat - Form message JSON format",
            "type": "object",
            "properties": {
                "type": { "type": "string", "const": "form" },
                "elements": {
                    "type": "array",
                    "items": { "anyOf": [
                        { "$ref": "/twc-schemas/form-elements/labels" },
                        { "$ref": "/twc-schemas/form-elements/control" },
                        { "$ref": "/twc-schemas/form-elements/input" },
                        { "$ref": "/twc-schemas/form-elements/textarea" },
                        { "$ref": "/twc-schemas/form-elements/select" }
                    ] },
                    "minItems": 1
                }
            },
            "required": ["type"],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/helpers/style-postback": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/helpers/style-postback",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "description": "Helper type for buttons and quick replies",
            "type": "object",
            "properties": {
                "title": { "type": "string" },
                "style": { "type": "string" },
                "postback": { "type": "string" },
                "parameters": { "type": "object" }
            },
            "required": ["title", "postback"],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/helpers/postback": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/helpers/postback",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "description": "Helper type for clickable lists",
            "type": "object",
            "properties": {
                "title": { "type": "string" },
                "postback": { "type": "string" },
                "parameters": { "type": "object" }
            },
            "required": ["title", "postback"],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/helpers/link": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/helpers/link",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "description": "Helper type for clickable lists",
            "type": "object",
            "properties": {
                "title": { "type": "string" },
                "url": { "type": "string" },
                "target": { "type": "string" }
            },
            "required": ["url"],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/form-elements/labels": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/form-elements/labels",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "description": "Form Label / Title / Subtitle / Caption",
            "type": "object",
            "properties": {
                "type": { "type": "string", "enum": ["title", "subtitle", "label", "caption"] },
                "text": { "type": "string" }
            },
            "required": ["type", "text"],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/form-elements/control": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/form-elements/control",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "description": "Form Control (OK / Cancel button)",
            "type": "object",
            "properties": {
                "type": { "type": "string", "const": "control" },
                "text": { "type": "string" },
                "action": { "type": "string", "enum": ["submit", "cancel"] }
            },
            "required": ["type", "text", "action"],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/form-elements/input": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/form-elements/input",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "description": "Form Input Element",
            "type": "object",
            "properties": {
                "type": { "type": "string", "const": "input" },
                "label": { "type": "string" },
                "attributes": {
                    "type": "object",
                    "$ref": "/twc-schemas/form-elements/element-attributes"
                }
            },
            "required": ["type"],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/form-elements/element-attributes": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/form-elements/element-attributes",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "description": "Form Element Attributes",
            "type": "object",
            "properties": {
                "type": { "type": "string" },
                "required": { "type": "boolean" },
                "pattern": { "type": "string" },
                "title": { "type": "string" },
                "value": { "type": "string" },
                "name": { "type": "string" },
                "disabled": { "type": "boolean" }
            },
            "additionalProperties": true
        },
        "https://json-schema.teneo.ai/twc-schemas/form-elements/textarea": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/form-elements/textarea",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "description": "Form Text Area Element",
            "type": "object",
            "properties": {
                "type": { "type": "string", "const": "textarea" },
                "text": { "type": "string" },
                "label": { "type": "string" },
                "placeholder": { "type": "string" },
                "attributes": {
                    "type": "object",
                    "$ref": "/twc-schemas/form-elements/element-attributes"
                }
            },
            "required": ["type"],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/form-elements/select": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/form-elements/select",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "description": "Form Select Element",
            "type": "object",
            "properties": {
                "type": { "type": "string", "const": "select" },
                "label": { "type": "string" },
                "options": {
                    "type": "array",
                    "items": { "$ref": "/twc-schemas/form-elements/select-option" },
                    "minItems": 1
                },
                "attributes": {
                    "type": "object",
                    "$ref": "/twc-schemas/form-elements/element-attributes"
                }
            },
            "required": ["type"],
            "additionalProperties": false
        },
        "https://json-schema.teneo.ai/twc-schemas/form-elements/select-option": {
            "$id": "https://json-schema.teneo.ai/twc-schemas/form-elements/select-option",
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "description": "Form Select Element - Option Item",
            "type": "object",
            "properties": {
                "text": { "type": "string" },
                "attributes": {
                    "type": "object",
                    "$ref": "/twc-schemas/form-elements/element-attributes"
                }
            },
            "additionalProperties": false
        }
    }
}`;

// For now we ignore the uri format - we COULD add this and validate https://ajv.js.org/packages/ajv-formats.html
const ajv = new Ajv({ formats: { uri: true } });

const twcValidator = ajv.compile(JSON.parse(twcSchemaJson));

export default function validateTwcMessage(twcMessage, onError) {
    const valid = twcValidator(twcMessage);

    if (valid) {
        return true;
    }

    const { errors } = twcValidator;

    onError(errors);

    return false;
}
