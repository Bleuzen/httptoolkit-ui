/*
 * We use this schema to filter loaded OpenAPI specs for only valid & relevant properties.
 * This is based on https://raw.githubusercontent.com/handrews/OpenAPI-Specification/157a4c8/schemas/v3.1/schema.json,
 * but with a few changes:
 *
 * - drop $schema
 * - non-essential extension fields made invalid
 * - explicitly added the specific info x-* properties we need
 * - oneOf changed to anyOf in all cases (relaxing constraints)
 *
 * All in all this makes the schema stricter about x-*, but more lax about everything
 * else. Updates will need similar treatment, but a diff should make it easy enough.
*/

export const openApiSchema = {
  "$id": "https://spec.openapis.org/oas/3.1/schema/2022-10-07",
  "description": "The description of OpenAPI v3.1.x documents without schema validation, as defined by https://spec.openapis.org/oas/v3.1.0",
  "type": "object",
  "properties": {
    "openapi": {
      "type": "string",
      "pattern": "^3\\.1\\.\\d+(-.+)?$"
    },
    "info": {
      "$ref": "#/$defs/info"
    },
    "jsonSchemaDialect": {
      "type": "string",
      "format": "uri",
      "default": "https://spec.openapis.org/oas/3.1/dialect/base"
    },
    "servers": {
      "type": "array",
      "items": {
        "$ref": "#/$defs/server"
      },
      "default": [
        {
          "url": "/"
        }
      ]
    },
    "paths": {
      "$ref": "#/$defs/paths"
    },
    "webhooks": {
      "type": "object",
      "additionalProperties": {
        "$ref": "#/$defs/path-item-or-reference"
      }
    },
    "components": {
      "$ref": "#/$defs/components"
    },
    "security": {
      "type": "array",
      "items": {
        "$ref": "#/$defs/security-requirement"
      }
    },
    "tags": {
      "type": "array",
      "items": {
        "$ref": "#/$defs/tag"
      }
    },
    "externalDocs": {
      "$ref": "#/$defs/external-documentation"
    }
  },
  "required": [
    "openapi",
    "info"
  ],
  "anyOf": [
    {
      "required": [
        "paths"
      ]
    },
    {
      "required": [
        "components"
      ]
    },
    {
      "required": [
        "webhooks"
      ]
    }
  ],
  "unevaluatedProperties": false,
  "$defs": {
    "info": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#info-object",
      "type": "object",
      "properties": {
        "title": {
          "type": "string"
        },
        "summary": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "termsOfService": {
          "type": "string",
          "format": "uri"
        },
        "contact": {
          "$ref": "#/$defs/contact"
        },
        "license": {
          "$ref": "#/$defs/license"
        },
        "version": {
          "type": "string"
        },
        "x-logo": {
          "type": "object",
          "properties": {
            "url": {
              "type": "string"
            }
          }
        },
        "x-httptoolkit-builtin-api": {
          "type": "boolean",
          "default": false
        },
        "x-httptoolkit-short-name": {
          "type": "string"
        }
      },
      "required": [
        "title",
        "version"
      ],
      "unevaluatedProperties": false
    },
    "contact": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#contact-object",
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "url": {
          "type": "string",
          "format": "uri"
        },
        "email": {
          "type": "string",
          "format": "email"
        }
      },
      "unevaluatedProperties": false
    },
    "license": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#license-object",
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "identifier": {
          "type": "string"
        },
        "url": {
          "type": "string",
          "format": "uri"
        }
      },
      "required": [
        "name"
      ],
      "dependentSchemas": {
        "identifier": {
          "not": {
            "required": [
              "url"
            ]
          }
        }
      },
      "unevaluatedProperties": false
    },
    "server": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#server-object",
      "type": "object",
      "properties": {
        "url": {
          "type": "string",
          "format": "uri-reference"
        },
        "description": {
          "type": "string"
        },
        "variables": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/$defs/server-variable"
          }
        }
      },
      "required": [
        "url"
      ],
      "unevaluatedProperties": false
    },
    "server-variable": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#server-variable-object",
      "type": "object",
      "properties": {
        "enum": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "minItems": 1
        },
        "default": {
          "type": "string"
        },
        "description": {
          "type": "string"
        }
      },
      "required": [
        "default"
      ],
      "unevaluatedProperties": false
    },
    "components": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#components-object",
      "type": "object",
      "properties": {
        "schemas": {
          "type": "object",
          "additionalProperties": {
            "$dynamicRef": "#meta"
          }
        },
        "responses": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/$defs/response-or-reference"
          }
        },
        "parameters": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/$defs/parameter-or-reference"
          }
        },
        "examples": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/$defs/example-or-reference"
          }
        },
        "requestBodies": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/$defs/request-body-or-reference"
          }
        },
        "headers": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/$defs/header-or-reference"
          }
        },
        "securitySchemes": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/$defs/security-scheme-or-reference"
          }
        },
        "links": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/$defs/link-or-reference"
          }
        },
        "callbacks": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/$defs/callbacks-or-reference"
          }
        },
        "pathItems": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/$defs/path-item-or-reference"
          }
        }
      },
      "patternProperties": {
        "^(schemas|responses|parameters|examples|requestBodies|headers|securitySchemes|links|callbacks|pathItems)$": {
          "$comment": "Enumerating all of the property names in the regex above is necessary for unevaluatedProperties to work as expected",
          "propertyNames": {
            "pattern": "^[a-zA-Z0-9._-]+$"
          }
        }
      },
      "unevaluatedProperties": false
    },
    "paths": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#paths-object",
      "type": "object",
      "patternProperties": {
        "^/": {
          "$ref": "#/$defs/path-item"
        }
      },
      "unevaluatedProperties": false
    },
    "path-item": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#path-item-object",
      "type": "object",
      "properties": {
        "summary": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "servers": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/server"
          }
        },
        "parameters": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/parameter-or-reference"
          }
        },
        "get": {
          "$ref": "#/$defs/operation"
        },
        "put": {
          "$ref": "#/$defs/operation"
        },
        "post": {
          "$ref": "#/$defs/operation"
        },
        "delete": {
          "$ref": "#/$defs/operation"
        },
        "options": {
          "$ref": "#/$defs/operation"
        },
        "head": {
          "$ref": "#/$defs/operation"
        },
        "patch": {
          "$ref": "#/$defs/operation"
        },
        "trace": {
          "$ref": "#/$defs/operation"
        }
      },
      "unevaluatedProperties": false
    },
    "path-item-or-reference": {
      "if": {
        "type": "object",
        "required": [
          "$ref"
        ]
      },
      "then": {
        "$ref": "#/$defs/reference"
      },
      "else": {
        "$ref": "#/$defs/path-item"
      }
    },
    "operation": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#operation-object",
      "type": "object",
      "properties": {
        "tags": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "summary": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "externalDocs": {
          "$ref": "#/$defs/external-documentation"
        },
        "operationId": {
          "type": "string"
        },
        "parameters": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/parameter-or-reference"
          }
        },
        "requestBody": {
          "$ref": "#/$defs/request-body-or-reference"
        },
        "responses": {
          "$ref": "#/$defs/responses"
        },
        "callbacks": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/$defs/callbacks-or-reference"
          }
        },
        "deprecated": {
          "default": false,
          "type": "boolean"
        },
        "security": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/security-requirement"
          }
        },
        "servers": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/server"
          }
        }
      },
      "unevaluatedProperties": false
    },
    "external-documentation": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#external-documentation-object",
      "type": "object",
      "properties": {
        "description": {
          "type": "string"
        },
        "url": {
          "type": "string",
          "format": "uri"
        }
      },
      "required": [
        "url"
      ],
      "unevaluatedProperties": false
    },
    "parameter": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#parameter-object",
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "in": {
          "enum": [
            "query",
            "header",
            "path",
            "cookie"
          ]
        },
        "description": {
          "type": "string"
        },
        "required": {
          "default": false,
          "type": "boolean"
        },
        "deprecated": {
          "default": false,
          "type": "boolean"
        },
        "schema": {
          "$dynamicRef": "#meta"
        },
        "content": {
          "$ref": "#/$defs/content",
          "minProperties": 1,
          "maxProperties": 1
        }
      },
      "required": [
        "name",
        "in"
      ],
      "anyOf": [
        {
          "required": [
            "schema"
          ]
        },
        {
          "required": [
            "content"
          ]
        }
      ],
      "if": {
        "properties": {
          "in": {
            "const": "query"
          }
        },
        "required": [
          "in"
        ]
      },
      "then": {
        "properties": {
          "allowEmptyValue": {
            "default": false,
            "type": "boolean"
          }
        }
      },
      "dependentSchemas": {
        "schema": {
          "properties": {
            "style": {
              "type": "string"
            },
            "explode": {
              "type": "boolean"
            }
          },
          "allOf": [
            {
              "$ref": "#/$defs/examples"
            },
            {
              "$ref": "#/$defs/parameter/dependentSchemas/schema/$defs/styles-for-path"
            },
            {
              "$ref": "#/$defs/parameter/dependentSchemas/schema/$defs/styles-for-header"
            },
            {
              "$ref": "#/$defs/parameter/dependentSchemas/schema/$defs/styles-for-query"
            },
            {
              "$ref": "#/$defs/parameter/dependentSchemas/schema/$defs/styles-for-cookie"
            },
            {
              "$ref": "#/$defs/parameter/dependentSchemas/schema/$defs/styles-for-form"
            }
          ],
          "$defs": {
            "styles-for-path": {
              "if": {
                "properties": {
                  "in": {
                    "const": "path"
                  }
                },
                "required": [
                  "in"
                ]
              },
              "then": {
                "properties": {
                  "name": {
                    "pattern": "[^/#?]+$"
                  },
                  "style": {
                    "default": "simple",
                    "enum": [
                      "matrix",
                      "label",
                      "simple"
                    ]
                  },
                  "required": {
                    "const": true
                  }
                },
                "required": [
                  "required"
                ]
              }
            },
            "styles-for-header": {
              "if": {
                "properties": {
                  "in": {
                    "const": "header"
                  }
                },
                "required": [
                  "in"
                ]
              },
              "then": {
                "properties": {
                  "style": {
                    "default": "simple",
                    "const": "simple"
                  }
                }
              }
            },
            "styles-for-query": {
              "if": {
                "properties": {
                  "in": {
                    "const": "query"
                  }
                },
                "required": [
                  "in"
                ]
              },
              "then": {
                "properties": {
                  "style": {
                    "default": "form",
                    "enum": [
                      "form",
                      "spaceDelimited",
                      "pipeDelimited",
                      "deepObject"
                    ]
                  },
                  "allowReserved": {
                    "default": false,
                    "type": "boolean"
                  }
                }
              }
            },
            "styles-for-cookie": {
              "if": {
                "properties": {
                  "in": {
                    "const": "cookie"
                  }
                },
                "required": [
                  "in"
                ]
              },
              "then": {
                "properties": {
                  "style": {
                    "default": "form",
                    "const": "form"
                  }
                }
              }
            },
            "styles-for-form": {
              "if": {
                "properties": {
                  "style": {
                    "const": "form"
                  }
                },
                "required": [
                  "style"
                ]
              },
              "then": {
                "properties": {
                  "explode": {
                    "default": true
                  }
                }
              },
              "else": {
                "properties": {
                  "explode": {
                    "default": false
                  }
                }
              }
            }
          }
        }
      },
      "unevaluatedProperties": false
    },
    "parameter-or-reference": {
      "if": {
        "type": "object",
        "required": [
          "$ref"
        ]
      },
      "then": {
        "$ref": "#/$defs/reference"
      },
      "else": {
        "$ref": "#/$defs/parameter"
      }
    },
    "request-body": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#request-body-object",
      "type": "object",
      "properties": {
        "description": {
          "type": "string"
        },
        "content": {
          "$ref": "#/$defs/content"
        },
        "required": {
          "default": false,
          "type": "boolean"
        }
      },
      "required": [
        "content"
      ],
      "unevaluatedProperties": false
    },
    "request-body-or-reference": {
      "if": {
        "type": "object",
        "required": [
          "$ref"
        ]
      },
      "then": {
        "$ref": "#/$defs/reference"
      },
      "else": {
        "$ref": "#/$defs/request-body"
      }
    },
    "content": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#fixed-fields-10",
      "type": "object",
      "additionalProperties": {
        "$ref": "#/$defs/media-type"
      },
      "propertyNames": {
        "format": "media-range"
      }
    },
    "media-type": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#media-type-object",
      "type": "object",
      "properties": {
        "schema": {
          "$dynamicRef": "#meta"
        },
        "encoding": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/$defs/encoding"
          }
        }
      },
      "allOf": [
        {
          "$ref": "#/$defs/examples"
        }
      ],
      "unevaluatedProperties": false
    },
    "encoding": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#encoding-object",
      "type": "object",
      "properties": {
        "contentType": {
          "type": "string",
          "format": "media-range"
        },
        "headers": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/$defs/header-or-reference"
          }
        },
        "style": {
          "default": "form",
          "enum": [
            "form",
            "spaceDelimited",
            "pipeDelimited",
            "deepObject"
          ]
        },
        "explode": {
          "type": "boolean"
        },
        "allowReserved": {
          "default": false,
          "type": "boolean"
        }
      },
      "allOf": [
        {
          "$ref": "#/$defs/encoding/$defs/explode-default"
        }
      ],
      "unevaluatedProperties": false,
      "$defs": {
        "explode-default": {
          "if": {
            "properties": {
              "style": {
                "const": "form"
              }
            },
            "required": [
              "style"
            ]
          },
          "then": {
            "properties": {
              "explode": {
                "default": true
              }
            }
          },
          "else": {
            "properties": {
              "explode": {
                "default": false
              }
            }
          }
        }
      }
    },
    "responses": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#responses-object",
      "type": "object",
      "properties": {
        "default": {
          "$ref": "#/$defs/response-or-reference"
        }
      },
      "patternProperties": {
        "^[1-5](?:[0-9]{2}|XX)$": {
          "$ref": "#/$defs/response-or-reference"
        }
      },
      "minProperties": 1,
      "unevaluatedProperties": false
    },
    "response": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#response-object",
      "type": "object",
      "properties": {
        "description": {
          "type": "string"
        },
        "headers": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/$defs/header-or-reference"
          }
        },
        "content": {
          "$ref": "#/$defs/content"
        },
        "links": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/$defs/link-or-reference"
          }
        }
      },
      "required": [
        "description"
      ],
      "unevaluatedProperties": false
    },
    "response-or-reference": {
      "if": {
        "type": "object",
        "required": [
          "$ref"
        ]
      },
      "then": {
        "$ref": "#/$defs/reference"
      },
      "else": {
        "$ref": "#/$defs/response"
      }
    },
    "callbacks": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#callback-object",
      "type": "object",
      "additionalProperties": {
        "$ref": "#/$defs/path-item-or-reference"
      }
    },
    "callbacks-or-reference": {
      "if": {
        "type": "object",
        "required": [
          "$ref"
        ]
      },
      "then": {
        "$ref": "#/$defs/reference"
      },
      "else": {
        "$ref": "#/$defs/callbacks"
      }
    },
    "example": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#example-object",
      "type": "object",
      "properties": {
        "summary": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "value": true,
        "externalValue": {
          "type": "string",
          "format": "uri"
        }
      },
      "not": {
        "required": [
          "value",
          "externalValue"
        ]
      },
      "unevaluatedProperties": false
    },
    "example-or-reference": {
      "if": {
        "type": "object",
        "required": [
          "$ref"
        ]
      },
      "then": {
        "$ref": "#/$defs/reference"
      },
      "else": {
        "$ref": "#/$defs/example"
      }
    },
    "link": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#link-object",
      "type": "object",
      "properties": {
        "operationRef": {
          "type": "string",
          "format": "uri-reference"
        },
        "operationId": {
          "type": "string"
        },
        "parameters": {
          "$ref": "#/$defs/map-of-strings"
        },
        "requestBody": true,
        "description": {
          "type": "string"
        },
        "body": {
          "$ref": "#/$defs/server"
        }
      },
      "anyOf": [
        {
          "required": [
            "operationRef"
          ]
        },
        {
          "required": [
            "operationId"
          ]
        }
      ],
      "unevaluatedProperties": false
    },
    "link-or-reference": {
      "if": {
        "type": "object",
        "required": [
          "$ref"
        ]
      },
      "then": {
        "$ref": "#/$defs/reference"
      },
      "else": {
        "$ref": "#/$defs/link"
      }
    },
    "header": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#header-object",
      "type": "object",
      "properties": {
        "description": {
          "type": "string"
        },
        "required": {
          "default": false,
          "type": "boolean"
        },
        "deprecated": {
          "default": false,
          "type": "boolean"
        },
        "schema": {
          "$dynamicRef": "#meta"
        },
        "content": {
          "$ref": "#/$defs/content",
          "minProperties": 1,
          "maxProperties": 1
        }
      },
      "anyOf": [
        {
          "required": [
            "schema"
          ]
        },
        {
          "required": [
            "content"
          ]
        }
      ],
      "dependentSchemas": {
        "schema": {
          "properties": {
            "style": {
              "default": "simple",
              "const": "simple"
            },
            "explode": {
              "default": false,
              "type": "boolean"
            }
          },
          "$ref": "#/$defs/examples"
        }
      },
      "unevaluatedProperties": false
    },
    "header-or-reference": {
      "if": {
        "type": "object",
        "required": [
          "$ref"
        ]
      },
      "then": {
        "$ref": "#/$defs/reference"
      },
      "else": {
        "$ref": "#/$defs/header"
      }
    },
    "tag": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#tag-object",
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "externalDocs": {
          "$ref": "#/$defs/external-documentation"
        }
      },
      "required": [
        "name"
      ],
      "unevaluatedProperties": false
    },
    "reference": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#reference-object",
      "type": "object",
      "properties": {
        "$ref": {
          "type": "string",
          "format": "uri-reference"
        },
        "summary": {
          "type": "string"
        },
        "description": {
          "type": "string"
        }
      },
      "unevaluatedProperties": false
    },
    "schema": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#schema-object",
      "$dynamicAnchor": "meta",
      "type": [
        "object",
        "boolean"
      ]
    },
    "security-scheme": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#security-scheme-object",
      "type": "object",
      "properties": {
        "type": {
          "enum": [
            "apiKey",
            "http",
            "mutualTLS",
            "oauth2",
            "openIdConnect"
          ]
        },
        "description": {
          "type": "string"
        }
      },
      "required": [
        "type"
      ],
      "allOf": [
        {
          "$ref": "#/$defs/security-scheme/$defs/type-apikey"
        },
        {
          "$ref": "#/$defs/security-scheme/$defs/type-http"
        },
        {
          "$ref": "#/$defs/security-scheme/$defs/type-http-bearer"
        },
        {
          "$ref": "#/$defs/security-scheme/$defs/type-oauth2"
        },
        {
          "$ref": "#/$defs/security-scheme/$defs/type-oidc"
        }
      ],
      "unevaluatedProperties": false,
      "$defs": {
        "type-apikey": {
          "if": {
            "properties": {
              "type": {
                "const": "apiKey"
              }
            },
            "required": [
              "type"
            ]
          },
          "then": {
            "properties": {
              "name": {
                "type": "string"
              },
              "in": {
                "enum": [
                  "query",
                  "header",
                  "cookie"
                ]
              }
            },
            "required": [
              "name",
              "in"
            ]
          }
        },
        "type-http": {
          "if": {
            "properties": {
              "type": {
                "const": "http"
              }
            },
            "required": [
              "type"
            ]
          },
          "then": {
            "properties": {
              "scheme": {
                "type": "string"
              }
            },
            "required": [
              "scheme"
            ]
          }
        },
        "type-http-bearer": {
          "if": {
            "properties": {
              "type": {
                "const": "http"
              },
              "scheme": {
                "type": "string",
                "pattern": "^[Bb][Ee][Aa][Rr][Ee][Rr]$"
              }
            },
            "required": [
              "type",
              "scheme"
            ]
          },
          "then": {
            "properties": {
              "bearerFormat": {
                "type": "string"
              }
            }
          }
        },
        "type-oauth2": {
          "if": {
            "properties": {
              "type": {
                "const": "oauth2"
              }
            },
            "required": [
              "type"
            ]
          },
          "then": {
            "properties": {
              "flows": {
                "$ref": "#/$defs/oauth-flows"
              }
            },
            "required": [
              "flows"
            ]
          }
        },
        "type-oidc": {
          "if": {
            "properties": {
              "type": {
                "const": "openIdConnect"
              }
            },
            "required": [
              "type"
            ]
          },
          "then": {
            "properties": {
              "openIdConnectUrl": {
                "type": "string",
                "format": "uri"
              }
            },
            "required": [
              "openIdConnectUrl"
            ]
          }
        }
      }
    },
    "security-scheme-or-reference": {
      "if": {
        "type": "object",
        "required": [
          "$ref"
        ]
      },
      "then": {
        "$ref": "#/$defs/reference"
      },
      "else": {
        "$ref": "#/$defs/security-scheme"
      }
    },
    "oauth-flows": {
      "type": "object",
      "properties": {
        "implicit": {
          "$ref": "#/$defs/oauth-flows/$defs/implicit"
        },
        "password": {
          "$ref": "#/$defs/oauth-flows/$defs/password"
        },
        "clientCredentials": {
          "$ref": "#/$defs/oauth-flows/$defs/client-credentials"
        },
        "authorizationCode": {
          "$ref": "#/$defs/oauth-flows/$defs/authorization-code"
        }
      },
      "unevaluatedProperties": false,
      "$defs": {
        "implicit": {
          "type": "object",
          "properties": {
            "authorizationUrl": {
              "type": "string",
              "format": "uri"
            },
            "refreshUrl": {
              "type": "string",
              "format": "uri"
            },
            "scopes": {
              "$ref": "#/$defs/map-of-strings"
            }
          },
          "required": [
            "authorizationUrl",
            "scopes"
          ],
          "unevaluatedProperties": false
        },
        "password": {
          "type": "object",
          "properties": {
            "tokenUrl": {
              "type": "string",
              "format": "uri"
            },
            "refreshUrl": {
              "type": "string",
              "format": "uri"
            },
            "scopes": {
              "$ref": "#/$defs/map-of-strings"
            }
          },
          "required": [
            "tokenUrl",
            "scopes"
          ],
          "unevaluatedProperties": false
        },
        "client-credentials": {
          "type": "object",
          "properties": {
            "tokenUrl": {
              "type": "string",
              "format": "uri"
            },
            "refreshUrl": {
              "type": "string",
              "format": "uri"
            },
            "scopes": {
              "$ref": "#/$defs/map-of-strings"
            }
          },
          "required": [
            "tokenUrl",
            "scopes"
          ],
          "unevaluatedProperties": false
        },
        "authorization-code": {
          "type": "object",
          "properties": {
            "authorizationUrl": {
              "type": "string",
              "format": "uri"
            },
            "tokenUrl": {
              "type": "string",
              "format": "uri"
            },
            "refreshUrl": {
              "type": "string",
              "format": "uri"
            },
            "scopes": {
              "$ref": "#/$defs/map-of-strings"
            }
          },
          "required": [
            "authorizationUrl",
            "tokenUrl",
            "scopes"
          ],
          "unevaluatedProperties": false
        }
      }
    },
    "security-requirement": {
      "$comment": "https://spec.openapis.org/oas/v3.1.0#security-requirement-object",
      "type": "object",
      "additionalProperties": {
        "type": "array",
        "items": {
          "type": "string"
        }
      }
    },
    "examples": {
      "properties": {
        "example": true,
        "examples": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/$defs/example-or-reference"
          }
        }
      }
    },
    "map-of-strings": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    }
  }
}
;