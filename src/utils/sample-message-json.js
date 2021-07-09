// These sample JSONs should match the latest documentation:
// https://www.teneo.ai/engine/channels/teneo-web-chat#message-types

export const textMessage = {
    'type': 'text',
    'data': {
        'text': 'Are you sure you wish to stop this chat?',
    }
};

export const audioMessage = {
    'type': 'audio',
    'data': {'audio_url': 'https://url.to/audio.mp3'},
};

export const quickReplyMessageJSON = {
    type: 'quickreply',
    data: {
        'quick_replies': [
            {
                'style': 'primary',
                'title': 'Primary',
                'postback': 'Primary'
            },
            {
                'style': 'secondary',
                'title': 'Secondary',
                'postback': 'Secondary'
            }
        ]
    }
};

export const buttonsMessage = {
    'type': 'buttons',
    data: {
        'title': 'Optional title',
        'button_items': [
            {
                'style': 'primary',
                'title': 'Primary',
                'postback': 'Primary'
            },
        ]
    }
};

export const cardMessageJSON = {
    'type': 'card',
    data: {
        'image': {
            'image_url': 'https://url.to/an/image.png',
            'alt': 'This is an image'
        },
        'title': 'This is the title',
        'subtitle': 'This is the subtitle',
        'text': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.'
    }
};
export const cardMessageJSONwithLinks = {
    'type': 'card',
    data: {
        'image': {
            'image_url': 'https://url.to/an/image.png',
            'alt': 'This is an image'
        },
        'title': 'This is the title',
        'subtitle': 'This is the subtitle',
        'text': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.',
        'link_items': [
            {
                'title': 'Card link',
                'url': 'https://url.to/a/page'
            },
            {
                'title': 'Another link',
                'url': 'https://url.to/another/page'
            }
        ]
    }
};
export const cardMessageJSONWithLinkButtons = {
    'type': 'card',
    data: {
        'image': {
            'image_url': 'https://as-freaky-styley-714c5e.bots.teneo.ai/teneo_web_chat_tes_3gzgctjx5q84x8fztj2bdzxtrh/images/trees.png',
            'alt': 'This is an image'
        },
        'title': 'This is the title',
        'subtitle': 'This is the subtitle',
        'text': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.',
        'linkbutton_items': [
            {
                'title': 'Studio',
                'url': 'https://developers.artificial-solutions.com/studio',
                'target': '_blank'
            },
            {
                'title': 'Engine',
                'url': 'https://developers.artificial-solutions.com/engine',
                'target': '_blank'
            }
        ]
    }
};
export const cardMessageJSONwithButtons = {
    'type': 'card',
    data: {
        'image': {
            'image_url': 'https://url.to/an/image.png',
            'alt': 'This is an image'
        },
        'title': 'This is the title',
        'subtitle': 'This is the subtitle',
        'text': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.',
        'link_items': [
            {
                'title': 'Card link',
                'url': 'https://url.to/a/page'
            },
            {
                'title': 'Another link',
                'url': 'https://url.to/another/page'
            }
        ]
    }
};
export const cardMessageJSONwithClickablelist = {
    'type': 'card',
    data: {
        'image': {
            'image_url': 'https://url.to/an/image.png',
            'alt': 'This is an image'
        },
        'title': 'This is the title',
        'subtitle': 'This is the subtitle',
        'text': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.',
        'link_items': [
            {
                'title': 'Card link',
                'url': 'https://url.to/a/page'
            },
            {
                'title': 'Another link',
                'url': 'https://url.to/another/page'
            }
        ]
    }
};

export const clickableListMessageJSON = {
    'type': 'clickablelist',
    data: {
        'title': 'Optional title',
        'list_items': [
            {
                'title': 'One',
                'postback': 'One'
            },
            {
                'title': 'Two',
                'postback': 'Two'
            },
        ]
    }
};

export const linkPreviewMessageJSON = {
    'type': 'linkpreview',
    data: {
        'title': 'Link title',
        'description': 'Short text for the preview',
        'url': 'https://example.com',
        'image': 'https://url.to/an/image.png'
    }
};

export const linkButtonsMessageJSON = {
    'type': 'linkbuttons',
    data: {
        'title': 'Optional title',
        'linkbutton_items': [
            {
                'title': 'Link 1',
                'url': '#'
            },
            {
                'title': 'Link 2',
                'url': 'https://developers.artificial-solutions.com/',
                'target': '_self'
            },
            {
                'title': 'Link 3',
                'url': 'https://developers.artificial-solutions.com/',
                'target': '_blank'
            }
        ]
    }
};


export const comboMessageJSON = {
    'author': 'bot',
    'type': 'combo',
    data: {
        'type': 'combo',
        'components': [
            {
                'type': 'text',
                'text': 'This is an additional speech bubble shown below the card.'
            },
            {
                'type': 'audio',
                'audio_url': 'https://url.to/audio.mp3',
            },
            {
                'type': 'quickreply',
                'quick_replies': [
                    {
                        'style': 'primary',
                        'title': 'Primary',
                        'postback': 'Primary'
                    },
                    {
                        'style': 'secondary',
                        'title': 'Secondary',
                        'postback': 'Secondary'
                    }
                ]
            },
            {
                'type': 'clickablelist',
                'title': 'Optional title',
                'list_items': [
                    {
                        'title': 'One',
                        'postback': 'One'
                    },
                    {
                        'title': 'Two',
                        'postback': 'Two'
                    },
                ]
            },
            {
                'type': 'image',
                'image_url': 'https://url.to/an/image.png',
                'alt': 'This is an image'
            },
            {
                'type': 'youtubevideo',
                'video_url': 'https://www.youtube.com/embed/123456789'
            },
            {
                'type': 'vimeovideo',
                'video_url': 'https://player.vimeo.com/video/12345678'
            },
            {
                'type': 'filevideo',
                'video_url': 'https://url.to/a/video.mp4'
            },
            {
                'type': 'buttons',
                'title': 'Are you sure?',
                'button_items': [
                    {
                        'style': 'danger',
                        'title': 'Yes',
                        'postback': 'Yes'
                    },
                    {
                        'style': 'success',
                        'title': 'No',
                        'postback': 'No'
                    }
                ]
            },
            {
                'type': 'card',
                'image': {
                    'image_url': 'https://as-freaky-styley-714c5e.bots.teneo.ai/tene…t_tes_3gzgctjx5q84x8fztj2bdzxtrh/images/trees.png',
                    'alt': 'This is an image'
                },
                'title': 'This is the title',
                'subtitle': 'This is the subtitle',
                'text': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.'
            },
            {
                'type': 'linkbuttons',
                'title': 'Optional title',
                'linkbutton_items': [
                    {
                        'title': 'Link 1',
                        'url': '#'
                    },
                    {
                        'title': 'Link 2',
                        'url': 'https://developers.artificial-solutions.com/',
                        'target': '_self'
                    },
                    {
                        'title': 'Link 3',
                        'url': 'https://developers.artificial-solutions.com/',
                        'target': '_blank'
                    }
                ]
            },
        ]
    }
};

export const carouselMessageJSON = {
    'author': 'bot',
    'type': 'carousel',
    data:
        {
            'carousel_items': [
                {
                    'type': 'card',
                    'image': {
                        'image_url': 'https://as-freaky-styley-714c5e.bots.teneo.ai/teneo_web_chat_tes_3gzgctjx5q84x8fztj2bdzxtrh/images/trees.png',
                        'alt': 'This is an image'
                    },
                    'title': 'Card 1',
                    'text': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.',
                    'button_items': [
                        {
                            'title': 'One',
                            'postback': 'One'
                        }, {
                            'title': 'Two',
                            'postback': 'Two'
                        }, {
                            'title': 'Three',
                            'postback': 'Three'
                        }
                    ]
                }, {
                    'type': 'card',
                    'image': {
                        'image_url': 'https://as-freaky-styley-714c5e.bots.teneo.ai/teneo_web_chat_tes_3gzgctjx5q84x8fztj2bdzxtrh/images/trees.png',
                        'alt': 'This is an image'
                    },
                    'title': 'Card 2',
                    'text': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.',
                    'list_items': [
                        {
                            'title': 'One',
                            'postback': 'One'
                        }, {
                            'title': 'Two',
                            'postback': 'Two'
                        }
                    ]
                }, {
                    'type': 'card',
                    'image': {
                        'image_url': 'https://as-freaky-styley-714c5e.bots.teneo.ai/teneo_web_chat_tes_3gzgctjx5q84x8fztj2bdzxtrh/images/trees.png',
                        'alt': 'Trees in a forrest'
                    },
                    'title': 'LinkButton Card',
                    'text': 'This is the text of the card.',
                    'linkbutton_items': [
                        {
                            'title': 'Studio',
                            'url': 'https://developers.artificial-solutions.com/studio',
                            'target': '_blank'
                        }, {
                            'title': 'Engine',
                            'url': 'https://developers.artificial-solutions.com/engine',
                            'target': '_blank'
                        }
                    ]
                }
            ]
        }

};

export const filevideoMessageJSON = {
    'type': 'filevideo',
    data: {
        'video_url': 'https://url.to/a/video.mp4'
    }
};

export const imageMessageJSON = {
    'type': 'image',
    data: {
        'image_url': 'https://url.to/an/image.png',
        'alt': 'This is an image'
    }
};

export const modalMessageJSON = {
    'type': 'modal',
    data: {
        'image': {
            'image_url': 'https://url.to/an/image.png',
            'alt': 'This is an image'
        },
        'title': 'This is the title',
        'text': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        'button_items': [
            {
                'style': 'secondary',
                'title': 'Secondary',
                'postback': 'modal-secondary'
            },
            {
                'style': 'danger',
                'title': 'Danger',
                'postback': 'modal-danger'
            }
        ]
    }
};

export const quickreplyMessageJSON = {
    'type': 'quickreply',
    data: {
        'quick_replies': [
            {
                'title': 'Small',
                'postback': 'small'
            },
            {
                'title': 'Medium',
                'postback': 'medium'
            }
        ]
    }
};

export const systemMessageJSON = {
    'type': 'system',
    data: {
        'text': 'This is a system message.'
    }
};

export const vimeovideoMessageJSON = {
    'type': 'vimeovideo',
    data: {
        'video_url': 'https://player.vimeo.com/video/12345678'
    }
};

export const youtubevideoMessageJSON = {
    'type': 'youtubevideo',
    data: {
        'video_url': 'https://www.youtube.com/embed/123456789'
    }
};

export const tableMessageJSON = {
    'type': 'table',
    data: {
        'title': 'Table Title',
        'headers': [
            'Header1',
            'Header2',
            'Header3'
        ],
        'body': [
            [
                'Row1 Cell1',
                'Row1 Cell2',
                'Row1 Cell3'
            ],
            [
                'Row2 Cell1',
                'Row2 Cell2',
                'Row2 Cell3',
                'Row2 Cell4'
            ],
            [
                'Row3 Cell1',
                'Row3 Cell2'
            ],
            [
                'Row4 Cell1',
                'Row4 Cell2',
                'Row4 Cell3'
            ],
            [
                'Row5 Cell1',
                'Row5 Cell2',
                'Row5 Cell3'
            ]
        ],
        'footers': [
            'Footer1',
            'Footer2'
        ]
    }
}

export const formMessageJSON = {
    'type': 'form',
    data: {
        'elements': [
            {
                'type': 'title',
                'text': 'Form Title'
            },
            {
                'type': 'subtitle',
                'text': 'Form Subtitle'
            },
            {
                'type': 'label',
                'text': 'This is an additional label to let people know * means required'
            },
            {
                'type': 'input',
                'attributes': {
                    'required': true,
                    'type': 'text'
                },
                'label': 'Text Input Required Example'
            },
            {
                'type': 'input',
                'attributes': {
                    'type': 'text',
                    'pattern': '[A-Za-z]{3}',
                    'required': true,
                    'title': 'Three Letters Only'
                },
                'label': 'Text Input Validation Pattern Example - 3 letters'
            },
            {
                'type': 'label',
                'text': 'These inputs are extra buttons that do nothing!'
            },
            {
                'type': 'input',
                'attributes': {
                    'type': 'button',
                    'value': 'Boink',
                    'onclick': 'return "one"'
                }
            },
            {
                'type': 'input',
                'attributes': {
                    'type': 'button',
                    'value': 'Doink',
                    'onclick': 'return "two"'
                }
            },
            {
                'type': 'label',
                'text': 'These inputs are radio buttons'
            },
            {
                'type': 'input',
                'attributes': {
                    'type': 'radio',
                    'value': '1',
                    'name': 'radios'
                },
                'label': 'one'
            },
            {
                'type': 'input',
                'attributes': {
                    'type': 'radio',
                    'value': '2',
                    'name': 'radios'
                },
                'label': 'two'
            },
            {
                'type': 'input',
                'attributes': {
                    'type': 'radio',
                    'value': '3',
                    'name': 'radios'
                },
                'label': 'three'
            },
            {
                'type': 'input',
                'attributes': {
                    'type': 'radio',
                    'value': '4',
                    'name': 'radios'
                },
                'label': 'four'
            },
            {
                'type': 'label',
                'text': 'These inputs are checkboxes'
            },
            {
                'type': 'input',
                'attributes': {
                    'type': 'checkbox',
                    'value': 'dog'
                },
                'label': 'dog'
            },
            {
                'type': 'input',
                'attributes': {
                    'type': 'checkbox',
                    'value': 'cat'
                },
                'label': 'cat'
            },
            {
                'type': 'input',
                'attributes': {
                    'type': 'checkbox',
                    'value': 'hamster'
                },
                'label': 'hamster'
            },
            {
                'type': 'input',
                'attributes': {
                    'type': 'date'
                },
                'label': 'This input is a datepicker!'
            },
            {
                'type': 'input',
                'attributes': {
                    'type': 'time'
                },
                'label': 'This input is a timepicker!'
            },
            {
                'type': 'input',
                'attributes': {
                    'type': 'datetime-local'
                },
                'label': 'This input is a datetimepicker!'
            },
            {
                'type': 'input',
                'attributes': {
                    'type': 'color'
                },
                'label': 'This input is a colorpicker!'
            },
            {
                'type': 'input',
                'attributes': {
                    'type': 'range'
                },
                'label': 'This input is a range!'
            },
            {
                'type': 'input',
                'attributes': {
                    'type': 'reset',
                    'text': 'reset'
                },
                'label': 'This input is a reset!'
            },
            {
                'type': 'textarea',
                'text': 'Prepopulated text in textarea.',
                'label': 'Text Area Example'
            },
            {
                'type': 'select',
                'label': 'Example Select',
                'options': [
                    {
                        'text': 'select one below',
                        'attributes': {
                            'disabled': true
                        }
                    },
                    {
                        'text': '1'
                    },
                    {
                        'text': '2'
                    },
                    {
                        'text': '3'
                    }
                ]
            },
            {
                'type': 'control',
                'text': 'Cancel',
                'action': 'cancel'
            },
            {
                'type': 'control',
                'text': 'OK',
                'action': 'submit'
            },
            {
                'type': 'caption',
                'text': 'form caption'
            }
        ]
    }
}
