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
    'data': { 'audio_url': 'https://url.to/audio.mp3' },
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
