import { shallowMount, mount } from '@vue/test-utils';

import TextMessage from '@/components/messages/TextMessage.vue'
import AudioMessage from '@/components/messages/AudioMessage.vue'
import ButtonsMessage from '@/components/messages/ButtonsMessage.vue'
import CardMessage from '@/components/messages/CardMessage.vue'
import ClickablelistMessage from '@/components/messages/ClickablelistMessage.vue'
import ComboMessage from '@/components/messages/ComboMessage.vue'
import FilevideoMessage from '@/components/messages/FilevideoMessage.vue'
import ImageMessage from '@/components/messages/ImageMessage.vue'
import ModalMessage from '@/components/messages/ModalMessage.vue'
import QuickreplyMessage from '@/components/messages/QuickreplyMessage.vue'
import SystemMessage from '@/components/messages/SystemMessage.vue'
import VimeovideoMessage from '@/components/messages/VimeovideoMessage.vue'
import YoutubevideoMessage from '@/components/messages/YoutubevideoMessage.vue'

import * as sampleJSON  from "../../src/utils/sample-message-json";


describe('Test Message Components', () => {

    test('Assert TextMessage JSON', () => {
        const wrapper = mount(TextMessage,{
            propsData: {
                message: sampleJSON.textMessage
            }
        });
        expect(wrapper.exists()).toBe(true)  
    })


    test('Assert AudioMessage JSON', () => {
        const wrapper = mount(AudioMessage, {
            propsData: {
                message: sampleJSON.audioMessage
            }
        });
        expect(wrapper.exists()).toBe(true)
    })


    test('Assert ButtonsMessage JSON', () => {
        const wrapper = mount(ButtonsMessage, {
            propsData: {
                message: sampleJSON.buttonsMessage
            },
            computed: {
                isExpired: () => jest.fn()
            }
        });
        expect(wrapper.exists()).toBe(true)
    })


    test('Assert CardMessage JSON', () =>{

        const wrapper = mount(CardMessage, {
            propsData: {
                message : sampleJSON.cardMessageJSON
            },
            computed: {
                isExpired: () => jest.fn()
            }
        })
        const wrapperWithLinks = mount(CardMessage, {
            propsData: {
                message : sampleJSON.cardMessageJSONwithLinks
            },
            computed: {
                isExpired: () => jest.fn()
            }
        })
        const wrapperWithButtons = mount(CardMessage, {
            propsData: {
                message : sampleJSON.cardMessageJSONwithButtons
            },
            computed: {
                isExpired: () => jest.fn()
            }
        })
        const wrapperWithClickablelist = mount(CardMessage, {
            propsData: {
                message : sampleJSON.cardMessageJSONwithClickablelist
            },
            computed: {
                isExpired: () => jest.fn()
            }
        })
        expect(wrapper.exists()).toBe(true)
        expect(wrapperWithLinks.exists()).toBe(true)
        expect(wrapperWithButtons.exists()).toBe(true)
        expect(wrapperWithClickablelist.exists()).toBe(true)
    })

    
    test('Assert ClickablelistMessage JSON', () =>{
        const wrapper = mount(ClickablelistMessage, {
            propsData: {
                message : sampleJSON.clickableListMessageJSON
            },
            computed: {
                isExpired: () => jest.fn()
            }
        })
        expect(wrapper.exists()).toBe(true)
    })


    test('Assert ComboMessage JSON loads with nested components', () =>{ ///check number of rendered items
        const wrapper = mount(ComboMessage, {
            propsData: {
                message : sampleJSON.comboMessageJSON
            },
            computed: {
                isExpired: jest.fn().mockImplementation( () => {   
                    return false;
                  }),
                replySent: jest.fn().mockImplementation( () => {   
                    return false;
                }),
            }
        })

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.html()).toContain('twc-text-message')
        expect(wrapper.html()).toContain('twc-text-message__text')
        expect(wrapper.html()).toContain('twc-audio-message');
        expect(wrapper.html()).toContain('twc-quickreply-message')
        expect(wrapper.html()).toContain('twc-clickablelist');
        expect(wrapper.html()).toContain('twc-image-message')
        expect(wrapper.html()).toContain('twc-youtube-video')
        expect(wrapper.html()).toContain('twc-file-video')
        expect(wrapper.html()).toContain('twc-vimeo-video')
        expect(wrapper.html()).toContain('twc-buttons');
        expect(wrapper.html()).toContain('twc-card')
    })


    test('Assert FilevideoMessage JSON', () =>{
        const wrapper = mount(FilevideoMessage, {
            propsData: {
                message: sampleJSON.filevideoMessageJSON
            },
            computed: {
                videoUrl: jest.fn().mockImplementation( () => {   
                    return sampleJSON.filevideoMessageJSON.data.video_url + '#t=0.1';
                  }), 
            }
        })
        expect(wrapper.html()).toContain('twc-file-video')
    })


    test('Assert ImageMessage JSON', () =>{
        const wrapper = mount(ImageMessage, {
            propsData: {
                message: sampleJSON.imageMessageJSON
            },
            computed: {
                imageUrl: jest.fn().mockImplementation( () => {   
                    return sampleJSON.imageMessageJSON.data.image_url;
                  }), 
            }
        })
        expect(wrapper.html()).toContain('twc-image-message') 
    })
    
    
    test('Assert ModalMessage JSON', () =>{
        const wrapper = mount(ModalMessage, {
            propsData: {
                message: sampleJSON.modalMessageJSON
            },
            computed: {
                imageUrl: jest.fn().mockImplementation( () => {   
                    return sampleJSON.modalMessageJSON.data.image_url;
                  }), 
            }
        })
        expect(wrapper.html()).toContain('twc-modal')
    })

    
    test('Assert QuickreplyMessage JSON', () =>{
        const wrapper = mount(QuickreplyMessage, {
            propsData: {
                message: sampleJSON.quickReplyMessageJSON
            },
            computed: {
                replySent: () => jest.fn().mockImplementation( () => {
                    return false;
                }),
                isExpired: () => jest.fn().mockImplementation( () => {
                    return false;
                }),
                
            }
        })
        const onSelectMock = jest.fn().mockImplementation( () => {
            return false;
        })
        wrapper.vm.onSelect = onSelectMock;
        expect(wrapper.html()).toContain('twc-primary')
    })


    test('Assert SystemMessage JSON', () =>{
        const wrapper = mount(SystemMessage, {
            propsData: {
                message: sampleJSON.systemMessageJSON
            },
            computed: {
                sanitizedHtmlText: jest.fn().mockImplementation( () => {   
                    return sampleJSON.systemMessageJSON.data.text ;
                }), 
            }
        })
        expect(wrapper.html()).toContain('twc-system-message')
    })


    test('Assert VimeovideoMessage JSON', () =>{
        const wrapper = mount(VimeovideoMessage, {
            propsData: {
                message: sampleJSON.vimeovideoMessageJSON
            },
            computed: {
                videoUrl: jest.fn().mockImplementation( () => {   
                    return sampleJSON.vimeovideoMessageJSON.data.video_url ;
                }), 
            }
        })
        expect(wrapper.html()).toContain('twc-vimeo-video')
    })

    
    test('Assert YoutubevideoMessage JSON', () =>{
        const wrapper = mount(YoutubevideoMessage, {
            propsData: {
                message: sampleJSON.youtubevideoMessageJSON
            },
            computed: {
                videoUrl: jest.fn().mockImplementation( () => {   
                    return sampleJSON.youtubevideoMessageJSON.data.video_url ;
                }), 
            }
        })
        expect(wrapper.html()).toContain('twc-youtube-video')
    })
     
})


