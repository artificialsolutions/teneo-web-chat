import {shallowMount, mount} from '@vue/test-utils';
import '@testing-library/jest-dom'

import TextMessage from '@/components/messages/TextMessage.vue'
import AudioMessage from '@/components/messages/AudioMessage.vue'
import ButtonsMessage from '@/components/messages/ButtonsMessage.vue'
import CardMessage from '@/components/messages/CardMessage.vue'
import ClickablelistMessage from '@/components/messages/ClickablelistMessage.vue'
import ComboMessage from '@/components/messages/ComboMessage.vue'
import CarouselMessage from '@/components/messages/CarouselMessage.vue'
import FilevideoMessage from '@/components/messages/FilevideoMessage.vue'
import ImageMessage from '@/components/messages/ImageMessage.vue'
import ModalMessage from '@/components/messages/ModalMessage.vue'
import QuickreplyMessage from '@/components/messages/QuickreplyMessage.vue'
import SystemMessage from '@/components/messages/SystemMessage.vue'
import VimeovideoMessage from '@/components/messages/VimeovideoMessage.vue'
import YoutubevideoMessage from '@/components/messages/YoutubevideoMessage.vue'
import LinkButtonsMessage from '@/components/messages/LinkButtonsMessage.vue'
import LinkPreviewMessage from '@/components/messages/LinkPreviewMessage.vue'
import TableMessage from '@/components/messages/TableMessage.vue'
import FormMessage from '@/components/messages/FormMessage.vue'

import * as sampleJSON from "../../src/utils/sample-message-json";

const mockTeneoApi = {
    sendBaseMessage: jest.fn(),
    sendMessage: jest.fn(),
    sendSilentMessage: jest.fn(),
    messageList: []
};

describe('Test Message Components', () => {

    test('Assert TextMessage JSON', () => {
        const wrapper = mount(TextMessage, {
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


    test('Assert CardMessage JSON', () => {

        const wrapper = mount(CardMessage, {
            propsData: {
                message: sampleJSON.cardMessageJSON
            },
            computed: {
                isExpired: () => jest.fn()
            }
        })
        const wrapperWithLinks = mount(CardMessage, {
            propsData: {
                message: sampleJSON.cardMessageJSONwithLinks
            },
            computed: {
                isExpired: () => jest.fn()
            }
        })
        const wrapperWithButtons = mount(CardMessage, {
            propsData: {
                message: sampleJSON.cardMessageJSONwithButtons
            },
            computed: {
                isExpired: () => jest.fn()
            }
        })
        const wrapperWithClickablelist = mount(CardMessage, {
            propsData: {
                message: sampleJSON.cardMessageJSONwithClickablelist
            },
            computed: {
                isExpired: () => jest.fn()
            }
        })

        const wrapperWithLinkButtons = mount(CardMessage, {
            propsData: {
                message: sampleJSON.cardMessageJSONWithLinkButtons
            }
        })

        expect(wrapper.exists()).toBe(true)
        expect(wrapperWithLinks.exists()).toBe(true)
        expect(wrapperWithButtons.exists()).toBe(true)
        expect(wrapperWithClickablelist.exists()).toBe(true)
        expect(wrapperWithLinkButtons.html()).toContain("<a role=\"link\" href=\"https://developers.artificial-solutions.com/engine\" target=\"_blank\" rel=\"noopener\" class=\"twc-linkbutton\">Engine</a>")
    })


    test('Assert ClickablelistMessage JSON', () => {
        const wrapper = mount(ClickablelistMessage, {
            propsData: {
                message: sampleJSON.clickableListMessageJSON
            },
            computed: {
                isExpired: () => jest.fn().mockImplementation(() => {
                    return false;
                }),
            }
        })
        expect(wrapper.html()).toContain('<li tabindex=\"-1\" role=\"button\" class=\"twc-clickablelist-message__item\">Two</li>')
    })


    test('Assert LinkButtonsMessage JSON', () => {
        const wrapper = mount(LinkButtonsMessage, {
            propsData: {
                message: sampleJSON.linkButtonsMessageJSON
            }
        })
        expect(wrapper.html()).toContain("<a role=\"link\" href=\"https://developers.artificial-solutions.com/\" target=\"_blank\" rel=\"noopener\" class=\"twc-linkbutton\">Link 3</a>")
    })

    test('Assert LinkPreviewMessage JSON', () => {
        const wrapper = mount(LinkPreviewMessage, {
            propsData: {
                message: sampleJSON.linkPreviewMessageJSON
            }
        })
        expect(wrapper.html()).toContain('twc-link-preview');
        expect(wrapper.html()).toContain('twc-link-preview-left-column');
        expect(wrapper.html()).toContain('twc-link-preview-right-column');
        expect(wrapper.html()).toContain('twc-link-preview-title');
        expect(wrapper.html()).toContain('twc-link-preview-description');
        expect(wrapper.html()).toContain('twc-link-preview-domain');
    })

    test('Assert TableMessage JSON', () => {
        const wrapper = mount(TableMessage, {
            propsData: {
                message: sampleJSON.tableMessageJSON
            }
        })
        expect(wrapper.element).toHaveClass('twc-table');
        expect(wrapper.html()).toContain('twc-table-header-row');
        expect(wrapper.html()).toContain('twc-table-header-cell');
        expect(wrapper.html()).toContain('twc-table-body-row');
        expect(wrapper.html()).toContain('twc-table-body-cell');
        expect(wrapper.html()).toContain('twc-table-footer-row');
        expect(wrapper.html()).toContain('twc-table-footer-cell');
    })

    test('Assert FormMessage JSON', async () => {


        const wrapper = mount(FormMessage, {
            propsData: {
                message: sampleJSON.formMessageJSON
            },
            attachTo: document.body
        })

        const mockUserCallbacks = {
            'one': jest.fn(),
            'two': jest.fn()
        };

        let jsonEntries = sampleJSON.formMessageJSON.data.elements
        //Form elements
        let formElement = wrapper.element
        let formChildren = formElement.children
        let formTitle = formChildren[0];
        let formSubtitle = formChildren[1];
        let unassociatedLabel1 = formChildren[2];
        let requiredInputLabel = formChildren[3];
        let requiredInput = wrapper.findAll('.twc-form-input[required]').at(0);//formChildren[4];
        let validatedInputLabel = formChildren[5];
        let validatedInput = wrapper.findAll('.twc-form-input[required]').at(1);//formChildren[6];
        let unassociatedLabel2 = formChildren[7];
        let dummyBtn1 = formChildren[8];
        let dummyBtn2 = formChildren[9];
        let radioInputsLabel = formChildren[10];
        let radioInputLabel1 = formChildren[11];
        let radioInput1 = formChildren[12];
        let radioInputLabel2 = formChildren[13];
        let radioInput2 = formChildren[14];
        let radioInputLabel3 = formChildren[15];
        let radioInput3 = formChildren[16];
        let radioInputLabel4 = formChildren[17];
        let radioInput4 = formChildren[18];
        let checkboxInputsLabel = formChildren[19];
        let checkboxInputLabel1 = formChildren[20];
        let checkboxInput1 = formChildren[21];
        let checkboxInputLabel2 = formChildren[22];
        let checkboxInput2 = formChildren[23];
        let checkboxInputLabel3 = formChildren[24];
        let checkboxInput3 = formChildren[25];
        let datePickerLabel = formChildren[26];
        let datePickerField = formChildren[27];
        let timePickerLabel = formChildren[28];
        let timePickerField = formChildren[29];
        let datetimePickerLabel = formChildren[30];
        let datetimePickerField = formChildren[31];
        let colorPickerLabel = formChildren[32];
        let colorPickerField = formChildren[33];
        let rangePickerLabel = formChildren[34];
        let rangePickerField = formChildren[35];
        let resetBtnLabel = formChildren[36];
        let resetBtn = wrapper.find('.twc-form-reset')//formChildren[37];
        let textAreaLabel = formChildren[38];
        let textAreaField = formChildren[39];
        let selectLabel = formChildren[40];
        let selectField = formChildren[41];
        let formCaption = formChildren[44];

        //TODO => Test whether user input is disabled and if caption is correctly set

        expect(formElement).toHaveClass('twc-form');
        //Check title and subtitle positioning
        expect(formTitle).toHaveClass('twc-form-title');
        expect(formSubtitle).toHaveClass('twc-form-subtitle');
        //Unassociated labels
        expect(unassociatedLabel1).toHaveClass('twc-form-label');
        expect(unassociatedLabel1).not.toHaveClass('twc-form-associated-label');
        expect(unassociatedLabel2).toHaveClass('twc-form-label');
        expect(unassociatedLabel2).not.toHaveClass('twc-form-associated-label');
        //Required text

        //Make sure label is assigned to element
        expect(requiredInputLabel).toBe(requiredInput.element.labels[0]);
        expect(requiredInputLabel).toHaveClass('twc-form-label');
        expect(requiredInputLabel).toHaveClass('twc-form-associated-label');
        expect(requiredInput.element).toBeRequired();
        expect(requiredInput.element).toHaveAttribute('type', 'text');
        expect(requiredInput.element).toHaveClass('twc-form-input');

        //Validated text
        expect(validatedInputLabel).toBe(validatedInput.element.labels[0]);
        expect(validatedInputLabel).toHaveClass('twc-form-label');
        expect(validatedInputLabel).toHaveClass('twc-form-associated-label');
        expect(validatedInput.element).toBeRequired();
        expect(validatedInput.element).toHaveAttribute('type', 'text');
        expect(validatedInput.element).toHaveClass('twc-form-input');
        //Check if validation attributes have been added
        expect(validatedInput.element).toHaveAttribute('pattern');
        expect(validatedInput.element).toHaveAttribute('title');


        expect(dummyBtn1).toHaveAttribute('type', 'button');
        expect(dummyBtn2).toHaveAttribute('type', 'button');
        expect(dummyBtn1).toHaveClass('twc-form-input');
        expect(dummyBtn2).toHaveClass('twc-form-input');

        dummyBtn1.onclick = mockUserCallbacks[dummyBtn1.onclick()]
        dummyBtn1.click();
        expect(mockUserCallbacks.one).toHaveBeenCalled();
        dummyBtn2.onclick = mockUserCallbacks[dummyBtn2.onclick()]
        dummyBtn2.click();
        expect(mockUserCallbacks.two).toHaveBeenCalled();


        //Check radio inputs

        expect(radioInputsLabel).toHaveClass('twc-form-label');
        expect(radioInputsLabel).not.toHaveClass('twc-form-associated-label');

        expect(radioInputLabel1).toBe(radioInput1.labels[0]);
        expect(radioInput1).toHaveAttribute('name', 'radios');
        expect(radioInput1).toHaveAttribute('type', 'radio');
        expect(radioInput1).toHaveClass('twc-form-input');

        expect(radioInputLabel2).toBe(radioInput2.labels[0]);
        expect(radioInput2).toHaveAttribute('name', 'radios');
        expect(radioInput2).toHaveAttribute('type', 'radio');
        expect(radioInput2).toHaveClass('twc-form-input');

        expect(radioInputLabel3).toBe(radioInput3.labels[0]);
        expect(radioInput3).toHaveAttribute('name', 'radios');
        expect(radioInput3).toHaveAttribute('type', 'radio');
        expect(radioInput3).toHaveClass('twc-form-input');

        expect(radioInputLabel4).toBe(radioInput4.labels[0]);
        expect(radioInput4).toHaveAttribute('name', 'radios');
        expect(radioInput4).toHaveAttribute('type', 'radio');
        expect(radioInput4).toHaveClass('twc-form-input');

        //Check if all radios with the same name toggle the selection
        expect(radioInput1).not.toBeChecked();
        radioInput1.click();
        expect(radioInput1).toBeChecked();
        radioInput2.click();
        expect(radioInput2).toBeChecked();
        expect(radioInput1).not.toBeChecked();

        //Checkboxes

        expect(checkboxInputsLabel).toHaveClass('twc-form-label');
        expect(checkboxInputsLabel).not.toHaveClass('twc-form-associated-label');

        expect(checkboxInputLabel1).toBe(checkboxInput1.labels[0]);
        expect(checkboxInput1).toHaveAttribute('type', 'checkbox');
        expect(checkboxInput1).toHaveClass('twc-form-input');

        expect(checkboxInputLabel2).toBe(checkboxInput2.labels[0]);
        expect(checkboxInput2).toHaveAttribute('type', 'checkbox');
        expect(checkboxInput2).toHaveClass('twc-form-input');

        expect(checkboxInputLabel3).toBe(checkboxInput3.labels[0]);
        expect(checkboxInput3).toHaveAttribute('type', 'checkbox');
        expect(checkboxInput3).toHaveClass('twc-form-input');

        expect(checkboxInput1).not.toBeChecked();
        checkboxInput1.click();
        expect(checkboxInput1).toBeChecked();

        expect(checkboxInput2).not.toBeChecked();
        checkboxInput2.click();
        expect(checkboxInput2).toBeChecked();

        expect(checkboxInput3).not.toBeChecked();
        checkboxInput3.click();
        expect(checkboxInput3).toBeChecked();

        //Date, time, datetime, color and range pickers

        expect(datePickerLabel).toHaveClass('twc-form-label');
        expect(datePickerLabel).toHaveClass('twc-form-associated-label');
        expect(datePickerLabel).toBe(datePickerField.labels[0]);
        expect(datePickerField).toHaveAttribute('type', 'date');
        expect(datePickerField).toHaveClass('twc-form-input');

        expect(timePickerLabel).toHaveClass('twc-form-label');
        expect(timePickerLabel).toHaveClass('twc-form-associated-label');
        expect(timePickerLabel).toBe(timePickerField.labels[0]);
        expect(timePickerField).toHaveAttribute('type', 'time');
        expect(timePickerField).toHaveClass('twc-form-input');

        expect(datetimePickerLabel).toHaveClass('twc-form-label');
        expect(datetimePickerLabel).toHaveClass('twc-form-associated-label');
        expect(datetimePickerLabel).toBe(datetimePickerField.labels[0]);
        expect(datetimePickerField).toHaveAttribute('type', 'datetime-local');
        expect(datetimePickerField).toHaveClass('twc-form-input');

        expect(colorPickerLabel).toHaveClass('twc-form-label');
        expect(colorPickerLabel).toHaveClass('twc-form-associated-label');
        expect(colorPickerLabel).toBe(colorPickerField.labels[0]);
        expect(colorPickerField).toHaveAttribute('type', 'color');
        expect(colorPickerField).toHaveClass('twc-form-input');

        expect(rangePickerLabel).toHaveClass('twc-form-label');
        expect(rangePickerLabel).toHaveClass('twc-form-associated-label');
        expect(rangePickerLabel).toBe(rangePickerField.labels[0]);
        expect(rangePickerField).toHaveAttribute('type', 'range');
        expect(rangePickerField).toHaveClass('twc-form-input');

        //test reset

        expect(resetBtnLabel).toHaveClass('twc-form-label');
        expect(resetBtnLabel).toHaveClass('twc-form-associated-label');
        expect(resetBtnLabel).toBe(resetBtn.element.labels[0]);

        requiredInput.setValue('test');
        validatedInput.setValue('abc');
        expect(requiredInput.element).toHaveValue('test')
        expect(validatedInput.element).toHaveValue('abc')
        expect(checkboxInput1).toBeChecked()
        expect(checkboxInput2).toBeChecked()
        expect(checkboxInput3).toBeChecked()
        expect(radioInput2).toBeChecked()


        await resetBtn.trigger('click');

        expect(requiredInput.element).not.toHaveValue('test')
        expect(validatedInput.element).not.toHaveValue('abc')
        expect(checkboxInput1).not.toBeChecked()
        expect(checkboxInput2).not.toBeChecked()
        expect(checkboxInput3).not.toBeChecked()
        expect(radioInput2).not.toBeChecked()


        //Test Text Area

        let textAreaEntryText = jsonEntries.filter(entry => entry.type === 'textarea')[0].text
        expect(textAreaLabel).toHaveClass('twc-form-label');
        expect(textAreaLabel).toHaveClass('twc-form-associated-label');
        expect(textAreaLabel).toBe(textAreaField.labels[0]);

        expect(textAreaField).toContainHTML('textarea');
        expect(textAreaField).toHaveValue(textAreaEntryText);
        expect(textAreaField).toHaveClass('twc-form-textarea');


        //Test Select option
        let selectEntry = jsonEntries.filter(entry => entry.type === 'select')[0]


        expect(selectLabel).toHaveClass('twc-form-label');
        expect(selectLabel).toHaveClass('twc-form-associated-label');
        expect(selectLabel).toBe(selectField.labels[0]);

        expect(selectField).toContainHTML('select')
        expect(selectField).toHaveClass('twc-form-select');

        expect(selectField.childElementCount).toEqual(selectEntry.options.length)

        for (let i = 0; i < selectField.childElementCount; i++) {
            expect(selectField.children[i].value).toEqual(selectEntry.options[i].text)
        }


    })

    test('Assert FormMessage Cancels and Expires', async () => {
        const handleFormCancel = jest.spyOn(FormMessage.methods, "handleFormCancel");
        const decommissionForm = jest.spyOn(FormMessage.methods, "decommissionForm");


        const wrapper = mount(FormMessage, {
            propsData: {
                message: sampleJSON.formMessageJSON
            },
            mocks: {
                $teneoApi: mockTeneoApi
            },
            attachTo: document.body
        })

        const $destroy = jest.spyOn(wrapper.vm, "$destroy");

        let cancelBtn = wrapper.find('.twc-form-cancel')
        //Test Cancel btn

        cancelBtn.trigger('click');
        expect(handleFormCancel).toHaveBeenCalled();
        expect(mockTeneoApi.sendSilentMessage).toHaveBeenCalledWith('{\"success\":false}')
        mockTeneoApi.sendSilentMessage.mockClear();

        await wrapper.vm.$nextTick();
        expect(decommissionForm).toHaveBeenCalled();
        expect(wrapper.element.attributes.getNamedItem('disabled')).toBeTruthy();
        expect($destroy).toHaveBeenCalled();


    })

    test('Assert FormMessage Submits', async () => {
        const handleFormSubmit = jest.spyOn(FormMessage.methods, "handleFormSubmit");

        const wrapper = mount(FormMessage, {
            propsData: {
                message: sampleJSON.formMessageJSON
            },
            mocks: {
                $teneoApi: mockTeneoApi
            },
            attachTo: document.body
        })

        let requiredInput = wrapper.findAll('.twc-form-input[required]').at(0);
        let validatedInput = wrapper.findAll('.twc-form-input[required]').at(1);

        //Add values to required fields and click
        requiredInput.setValue('test');
        validatedInput.setValue('abc');
        //Triggering event rather than clicking due to JSDOM bug https://github.com/jsdom/jsdom/issues/2898
        await wrapper.trigger('submit');
        await wrapper.vm.$nextTick();
        expect(handleFormSubmit).toHaveBeenCalled();
        expect(mockTeneoApi.sendSilentMessage).toHaveBeenCalledWith('{\"success\":true}');
        mockTeneoApi.sendSilentMessage.mockClear();
    })


    test('Assert ComboMessage JSON loads with nested components', () => { ///check number of rendered items
        const wrapper = mount(ComboMessage, {
            propsData: {
                message: sampleJSON.comboMessageJSON
            },
            computed: {
                isExpired: jest.fn().mockImplementation(() => {
                    return false;
                }),
                replySent: jest.fn().mockImplementation(() => {
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
        expect(wrapper.html()).toContain('<a role=\"link\" href=\"https://developers.artificial-solutions.com/\" target=\"_blank\" rel=\"noopener\" class=\"twc-linkbutton\">Link 3</a>')
    })


    test('Assert CarouselMessage JSON loads with nested components', () => { ///check number of rendered items
        const wrapper = mount(CarouselMessage, {
            propsData: {
                message: sampleJSON.carouselMessageJSON
            },
            computed: {
                isExpired: jest.fn().mockImplementation(() => {
                    return false;
                }),
                replySent: jest.fn().mockImplementation(() => {
                    return false;
                }),
            }
        })

        expect(wrapper.exists()).toBe(true)
        //Check for controlbox elements
        expect(wrapper.html()).toContain('twc-carousel-ctrl')
        expect(wrapper.html()).toContain('twc-carousel-ctrl-dots-container')
        expect(wrapper.findAll('button.twc-carousel-ctrl-arrows')).toHaveLength(2)
        expect(wrapper.findAll('button.twc-carousel-ctrl-dots').length).toBeGreaterThan(0)

        //Check there are three cards in the example
        expect(wrapper.findAll('.twc-carousel-list-item')).toHaveLength(3)


    })

    test('Assert carousel controls functionality', async () => {
        const fwdFunc = jest.spyOn(CarouselMessage.methods, "slideForward")
        const backFunc = jest.spyOn(CarouselMessage.methods, "slideBack")
        const skipToFunc = jest.spyOn(CarouselMessage.methods, "skipToSlide")
        const wrapper = mount(CarouselMessage, {
            propsData: {
                message: sampleJSON.carouselMessageJSON
            },
            computed: {
                isExpired: jest.fn().mockImplementation(() => {
                    return false;
                }),
                replySent: jest.fn().mockImplementation(() => {
                    return false;
                }),
            }
        })


        window.twcTmp = {touchstartX: ''};

        //Test sliding functions, buttons and gestures
        expect(wrapper.vm.$data.activeSlide).toBe(0);
        await wrapper.findComponent({ref: 'fwdBtn'}).trigger('click')
        wrapper.trigger('touchstart', {changedTouches: [{screenX: 200}]})
        wrapper.trigger('touchend', {changedTouches: [{screenX: 100}]})
        expect(fwdFunc).toHaveBeenCalledTimes(2);
        expect(wrapper.vm.$data.activeSlide).toBe(2);
        await wrapper.findComponent({ref: 'backBtn'}).trigger('click')
        wrapper.trigger('touchstart', {changedTouches: [{screenX: 100}]})
        wrapper.trigger('touchend', {changedTouches: [{screenX: 200}]})
        expect(backFunc).toHaveBeenCalledTimes(2);
        expect(wrapper.vm.$data.activeSlide).toBe(0);
        await wrapper.findComponent({ref: 'skipTo3'}).trigger('click')
        expect(skipToFunc).toHaveBeenCalledWith(3);
        expect(wrapper.vm.$data.activeSlide).toBe(2);
        await wrapper.findComponent({ref: 'skipTo2'}).trigger('click')
        expect(skipToFunc).toHaveBeenCalledWith(2);
        expect(wrapper.vm.$data.activeSlide).toBe(1);
        await wrapper.findComponent({ref: 'skipTo1'}).trigger('click')
        expect(skipToFunc).toHaveBeenCalledWith(1);
        expect(wrapper.vm.$data.activeSlide).toBe(0);
        delete window.twcTmp;

    })


    test('Assert FilevideoMessage JSON', () => {
        const wrapper = mount(FilevideoMessage, {
            propsData: {
                message: sampleJSON.filevideoMessageJSON
            },
            computed: {
                videoUrl: jest.fn().mockImplementation(() => {
                    return sampleJSON.filevideoMessageJSON.data.video_url + '#t=0.1';
                }),
            }
        })
        expect(wrapper.html()).toContain('twc-file-video')
    })


    test('Assert ImageMessage JSON', () => {
        const wrapper = mount(ImageMessage, {
            propsData: {
                message: sampleJSON.imageMessageJSON
            },
            computed: {
                imageUrl: jest.fn().mockImplementation(() => {
                    return sampleJSON.imageMessageJSON.data.image_url;
                }),
            }
        })
        expect(wrapper.html()).toContain('twc-image-message')
    })


    test('Assert ModalMessage JSON', () => {
        const wrapper = mount(ModalMessage, {
            propsData: {
                message: sampleJSON.modalMessageJSON
            },
            computed: {
                imageUrl: jest.fn().mockImplementation(() => {
                    return sampleJSON.modalMessageJSON.data.image_url;
                }),
            }
        })
        expect(wrapper.html()).toContain('twc-modal')
    })


    test('Assert QuickreplyMessage JSON', () => {
        const wrapper = mount(QuickreplyMessage, {
            propsData: {
                message: sampleJSON.quickReplyMessageJSON
            },
            computed: {
                replySent: () => jest.fn().mockImplementation(() => {
                    return false;
                }),
                isExpired: () => jest.fn().mockImplementation(() => {
                    return false;
                }),

            }
        })
        const onSelectMock = jest.fn().mockImplementation(() => {
            return false;
        })
        wrapper.vm.onSelect = onSelectMock;
        expect(wrapper.html()).toContain('<div class=\"twc-quickreply-message twc-expired\"><a role=\"button\" tabindex=\"-1\" class=\"twc-quickreply-message__item twc-primary\">Primary</a><a role=\"button\" tabindex=\"-1\" class=\"twc-quickreply-message__item twc-secondary\">Secondary</a></div>')
    })


    test('Assert SystemMessage JSON', () => {
        const wrapper = mount(SystemMessage, {
            propsData: {
                message: sampleJSON.systemMessageJSON
            },
            computed: {
                sanitizedHtmlText: jest.fn().mockImplementation(() => {
                    return sampleJSON.systemMessageJSON.data.text;
                }),
            }
        })
        expect(wrapper.html()).toContain("<p class=\"twc-system-message__text\">This is a system message.</p>")
    })


    test('Assert VimeovideoMessage JSON', () => {
        const wrapper = mount(VimeovideoMessage, {
            propsData: {
                message: sampleJSON.vimeovideoMessageJSON
            },
            computed: {
                videoUrl: jest.fn().mockImplementation(() => {
                    return sampleJSON.vimeovideoMessageJSON.data.video_url;
                }),
            }
        })
        expect(wrapper.html()).toContain('twc-vimeo-video')
    })


    test('Assert YoutubevideoMessage JSON', () => {
        const wrapper = mount(YoutubevideoMessage, {
            propsData: {
                message: sampleJSON.youtubevideoMessageJSON
            },
            computed: {
                videoUrl: jest.fn().mockImplementation(() => {
                    return sampleJSON.youtubevideoMessageJSON.data.video_url;
                }),
            }
        })
        expect(wrapper.html()).toContain('twc-youtube-video')
    })

})


