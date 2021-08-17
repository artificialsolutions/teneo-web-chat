import {shallowMount, mount} from '@vue/test-utils';
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/jest-dom'
import {JSDOM} from 'jsdom'
import path from 'path'
import ejs from 'ejs'
import index from '../../src/index.js' //appears unused, but is required to access window.TeneoWebChat
import * as api from "../../src/utils/api-function-names";

import TeneoWebChat from '@/components/../TeneoWebChat.vue'
import UserInput from '@/components/UserInput.vue'
import ButtonsMessage from '@/components/messages/ButtonsMessage.vue'
import CardMessage from '@/components/messages/CardMessage.vue'
import ClickablelistMessage from '@/components/messages/ClickablelistMessage.vue'
import QuickreplyMessage from '@/components/messages/QuickreplyMessage.vue'
import LaunchButton from '@/components/LaunchButton.vue'
import ChatWindow from '@/components/ChatWindow.vue'
import Header from '@/components/Header.vue'
import ModalMessage from '@/components/messages/ModalMessage.vue'

import {call} from "file-loader";
import teneoApiPlugin from '../../src/plugins/teneo-api.js';
import handleExtension from '../../src/utils/handle-extension.js';
import {_} from "core-js";
import * as constants from '../../src/utils/constants.js';

//TODO => Make sure all API calls are tested, including ASR/TTS and Output links.

jest.mock('@/../src/utils/handle-button-click')
import handleButtonClick from '@/../src/utils/handle-button-click'

handleButtonClick.mockImplementation(async () => {
    await handleExtension(api.API_ON_BUTTON_CLICK);
})


const index_js = path.resolve(__dirname, '../../src/index.js')


ejs.renderFile(index_js, function (err, str) {

    if (str) {
        let dom
        let container

        //Define Callbacks in an observable way for Spies
        const logcallback = function (msg) {
            //console.log(msg);
        }
        const callbacks = {
            onReadyCallback() {
                logcallback("onReady Callback OK");
            },
            onVisibilityChangedCallback() {
                logcallback("onVisibilityChanged Callback OK")
            },
            onInputSubmittedCallback() {
                logcallback('onInputSubmitted Callback OK') //sep18
            },
            onUserTypingCallback() {
                logcallback('onUserTyping Callback OK');
            },
            onEngineRequestCallback() {
                logcallback('onEngineRequest Callback OK')
            },
            onEngineResponseCallback() {
                logcallback('onEngineResponse Callback OK')
            },
            onNewMessageCallback() {
                logcallback('onNewMessageCallback OK')
            },
            onButtonClickCallback() {
                logcallback('onButtonClickCallback OK')
            },
            onOpenButtonClickedCallback() {
                logcallback('onButtonClickedCallback OK')
            },
            onCloseButtonClickedCallback() {
                logcallback('onCloseButtonClickedCallback OK')
            },
            onMinimizeButtonClickedCallback() {
                logcallback('onMinimizeButtonClickedCallback OK')
            },
            onModalButtonClickCallback() {
                logcallback('onModalButtonClickCallback OK')
            }
        }

        //Setup a Window for testing
        var testWindow;
        dom = new JSDOM(str);
        container = dom.window.document;
        testWindow = dom.window.globalThis;

        describe('Displays Vue components on Webpage Template', () => {
            beforeEach(() => {
                dom = new JSDOM(str);
                container = dom.window.document
            })


            test('Validates Window.TeneoWebChat and it\'s four method groups.', () => {
                expect(window.TeneoWebChat).toBeTruthy
                expect(window.TeneoWebChat.initialize).toBeTruthy
                expect(window.TeneoWebChat.on).toBeTruthy
                expect(window.TeneoWebChat.off).toBeTruthy
                expect(window.TeneoWebChat.get).toBeTruthy
                expect(window.TeneoWebChat.call).toBeTruthy
                expect(window.TeneoWebChat.version).toBeTruthy
            })

        })//end describe


        describe('Validate API object in Window', () => {
            //Setup a Window for testing
            var testWindow;
            beforeEach(() => {
                dom = new JSDOM(str);
                container = dom.window.document;
                testWindow = dom.window.globalThis;
            })

            test('Assert presence of methods in Window.TeneoWebChat', () => {
                expect(testWindow.TeneoWebChat).toBeTruthy
                expect(testWindow.TeneoWebChat.initialize).toBeTruthy
                expect(testWindow.TeneoWebChat.on).toBeTruthy
                expect(testWindow.TeneoWebChat.off).toBeTruthy
                expect(testWindow.TeneoWebChat.get).toBeTruthy
                expect(testWindow.TeneoWebChat.call).toBeTruthy
                expect(testWindow.TeneoWebChat.version).toBeTruthy
            })
        })

        describe('Test ".on" API callbacks', () => {

            //Setup a Window for testing
            var testWindow;
            beforeEach(() => {
                dom = new JSDOM(str);
                container = dom.window.document;
                testWindow = dom.window.globalThis;
            })


            test('API_ON_READY event triggers its callback', async () => {

                //Mock props and DOM element
                var element = container.getElementById('teneo-web-chat');

                const teneoProps = {
                    'teneoEngineUrl': 'https://teneo-api.com/some-bot',
                    'title': 'Teneo Web Chat',
                }

                //Set a Spy on the callback
                const onReadyCallbackSpy = jest.spyOn(callbacks, 'onReadyCallback');

                //Mock developer defined API callbacks
                const myReadyCallback = function () {
                    //mock the actions that are taken here:
                    callbacks.onReadyCallback();
                }
                testWindow.TeneoWebChat.on(api.API_ON_READY, myReadyCallback);

                //Initialize TeneoWebChat, this should lead to rendering the component and cause onReady event to happen
                testWindow.TeneoWebChat.initialize(element, teneoProps);

                //Clean up callback
                testWindow.TeneoWebChat.off(api.API_ON_READY);

                //Assert via spy, that onReady was called
                expect(onReadyCallbackSpy).toHaveBeenCalled();
            })


            test('API_ON_VISIBILITY_CHANGED triggers callback', async () => {
                //Set a Spy on the callback
                const onVisibilityChangedCallbackSpy = jest.spyOn(callbacks, 'onVisibilityChangedCallback');

                //Mock developer defined API callbacks
                const myVisibilityChangedCallback = function () {
                    callbacks.onVisibilityChangedCallback();
                }
                testWindow.TeneoWebChat.on(api.API_ON_VISIBILITY_CHANGED, myVisibilityChangedCallback);

                //Mount TWC Component
                const wrapper = shallowMount(TeneoWebChat, {
                    title: 'Teneo Web Chat',
                    teneoEngineUrl: 'https://teneo-api.com/some-bot',
                    propsData: {isChatOpen: false}
                })

                wrapper.vm.apiOnVisibilityChange = jest.fn().mockImplementation(async () => {
                    const data = {};
                    data[constants.API_KEY_VISIBILITY] = constants.API_STATE_MAXIMIZED;
                    await handleExtension(api.API_ON_VISIBILITY_CHANGED, data);
                })

                // Simulate 3 possible visibility changes: maximizing, minimizing, and direct call.
                await wrapper.vm.maximize()
                await wrapper.vm.minimize()
                await wrapper.vm.apiOnVisibilityChange()

                //Clean up callback
                testWindow.TeneoWebChat.off(api.API_ON_VISIBILITY_CHANGED);

                //Assert that the callback was called 3 times
                expect(onVisibilityChangedCallbackSpy).toHaveBeenCalledTimes(3);
            })

            test('API_ON_INPUT_SUBMIT and API_ON_USER_TYPING triggers callback', async () => {
                //Set a Spy on the callback
                const onInputSubmittedCallbackSpy = jest.spyOn(callbacks, 'onInputSubmittedCallback');
                const onUserTypingCallbackSpy = jest.spyOn(callbacks, 'onUserTypingCallback');

                //Mock developer defined API callbacks
                const myInputSubmittedCallback = function () {
                    callbacks.onInputSubmittedCallback();
                }
                const myUserTypingCallback = function () {
                    callbacks.onUserTypingCallback();
                }
                testWindow.TeneoWebChat.on(api.API_ON_INPUT_SUBMITTED, myInputSubmittedCallback);
                testWindow.TeneoWebChat.on(api.API_ON_USER_TYPING, myUserTypingCallback);

                //Mount UserInput component and simulate submitText event.
                const wrapperUserInput = shallowMount(UserInput, {
                    propsData: {
                        onSubmit: jest.fn()
                    },
                    mocks: {
                        $t: jest.fn()
                    }
                })
                //Simulate submitting text and user typing
                wrapperUserInput.vm.autoTextareaHeight = jest.fn()
                await wrapperUserInput.vm._submitText();
                await wrapperUserInput.vm.userTyping();

                //Clean up callbacks
                testWindow.TeneoWebChat.off(api.API_ON_INPUT_SUBMITTED);
                testWindow.TeneoWebChat.off(api.API_ON_USER_TYPING);

                //Assert that the callbacks were called.
                expect(onInputSubmittedCallbackSpy).toHaveBeenCalled;
                expect(onUserTypingCallbackSpy).toHaveBeenCalled;
            })


            test('API_ON_ENGINE_REQUEST and API_ON_ENGINE_RESPONSE trigger their respective callbacks', async () => {
                //Set a Spy on the callback
                const onEngineRequestCallbackSpy = jest.spyOn(callbacks, 'onEngineRequestCallback');
                const onEngineResponseCallbackSpy = jest.spyOn(callbacks, 'onEngineResponseCallback');


                //Mock developer defined API callbacks
                const myEngineRequestCallback = function () {
                    callbacks.onEngineRequestCallback();
                }
                const myEngineResponseCallback = function () {
                    callbacks.onEngineResponseCallback();
                }
                testWindow.TeneoWebChat.on(api.API_ON_ENGINE_REQUEST, myEngineRequestCallback);
                testWindow.TeneoWebChat.on(api.API_ON_ENGINE_RESPONSE, myEngineResponseCallback);


                //Mock sendBaseMessage, which emits events API_ON_ENGINE_REQUEST and API_ON_ENGINE_RESPONSE
                var teneoapi = teneoApiPlugin("www.mock-url.com")
                teneoapi.sendBaseMessage = jest.fn().mockImplementation(async () => {
                    var messageDetails = {
                        'text': 'mockText',
                        'channel': 'web-chat-mock'
                    }
                    await handleExtension(api.API_ON_ENGINE_REQUEST, messageDetails);
                    await handleExtension(api.API_ON_ENGINE_RESPONSE, messageDetails);
                })
                await teneoapi.sendBaseMessage();


                //Clean up callbacks
                testWindow.TeneoWebChat.off(api.API_ON_ENGINE_REQUEST);
                testWindow.TeneoWebChat.off(api.API_ON_ENGINE_RESPONSE);


                //Assert that the callbacks were called.
                expect(onEngineRequestCallbackSpy).toHaveBeenCalled();
                expect(onEngineResponseCallbackSpy).not.toHaveBeenCalled;
            })


            test('ON_NEW_MESSAGE triggers callback', async () => {
                //Set a Spy on the callback
                const onNewMessageCallbackSpy = jest.spyOn(callbacks, 'onNewMessageCallback');

                //Mock developer defined API callbacks
                const myNewMessageCallback = function () {
                    callbacks.onNewMessageCallback();
                }
                testWindow.TeneoWebChat.on(api.API_ON_NEW_MESSAGE, myNewMessageCallback);

                //Mock _onMessageReceived
                var teneoapi = teneoApiPlugin("www.mock-url.com")
                teneoapi._onMessageReceived = jest.fn().mockImplementation(async () => {
                    await handleExtension(api.API_ON_NEW_MESSAGE, {});
                })
                await teneoapi._onMessageReceived();

                //Clean up callbacks
                testWindow.TeneoWebChat.off(api.API_ON_NEW_MESSAGE);

                //Assert that the callback was called.
                expect(onNewMessageCallbackSpy).toHaveBeenCalled();
            })


            test('API_ON_BUTTON_CLICK triggers callback upon handleButtonClick', async () => {
                //Set a Spy on the callback
                const onButtonClickCallbackSpy = jest.spyOn(callbacks, 'onButtonClickCallback');

                //Mock developer defined API callbacks
                const myButtonClickCallback = function () {
                    callbacks.onButtonClickCallback();
                }
                testWindow.TeneoWebChat.on(api.API_ON_BUTTON_CLICK, myButtonClickCallback);

                //Simulate an incoming click from handleButtonClick
                handleButtonClick();

                //Clean up callbacks and counters
                testWindow.TeneoWebChat.off(api.API_ON_BUTTON_CLICK);

                //Assert that the callback was called, then clear mock call counter
                expect(onButtonClickCallbackSpy).toHaveBeenCalled();
                onButtonClickCallbackSpy.mockClear();
            })//end test


            test('API_ON_OPEN_BUTTON_CLICKED triggers callback', async () => {
                //Set a Spy on the callback
                const onOpenButtonClickedCallbackSpy = jest.spyOn(callbacks, 'onOpenButtonClickedCallback');

                //Mock developer defined API callbacks
                const myOpenButtonClickedCallback = function () {
                    callbacks.onOpenButtonClickedCallback();
                }
                testWindow.TeneoWebChat.on(api.API_ON_OPEN_BUTTON_CLICK, myOpenButtonClickedCallback);

                //Mount TWC Component
                const wrapper = mount(TeneoWebChat, {
                    title: 'Teneo Web Chat',
                    teneoEngineUrl: 'https://teneo-api.com/some-bot',
                    propsData: {isChatOpen: false},
                    mocks: {
                        $t: jest.fn()
                    }
                })

                // click the LaunchButton
                wrapper.find('#twc-launchbutton').trigger('click');

                //Clean up callback
                testWindow.TeneoWebChat.off(api.API_ON_OPEN_BUTTON_CLICK);

                //Assert that the callback was called
                expect(onOpenButtonClickedCallbackSpy).toHaveBeenCalledTimes(1);
            })


            test('API_ON_CLOSE_BUTTON_CLICKED triggers callback', async () => {
                //Set a Spy on the callback
                const onCloseButtonClickedCallbackSpy = jest.spyOn(callbacks, 'onCloseButtonClickedCallback');
                const onMinimizeButtonClickedCallbackSpy = jest.spyOn(callbacks, 'onMinimizeButtonClickedCallback')

                //Mock developer defined API callbacks
                const myCloseButtonClickedCallback = function () {
                    callbacks.onCloseButtonClickedCallback();
                }
                testWindow.TeneoWebChat.on(api.API_ON_CLOSE_BUTTON_CLICK, myCloseButtonClickedCallback);

                const myMinimizeClickedCallback = function () {
                    callbacks.onMinimizeButtonClickedCallback();
                }
                testWindow.TeneoWebChat.on(api.API_ON_MINIMIZE_BUTTON_CLICK, myMinimizeClickedCallback);


                //Mount TWC Component and mock closeChat callback
                const wrapper = mount(TeneoWebChat, {
                    title: 'Teneo Web Chat',
                    teneoEngineUrl: 'https://teneo-api.com/some-bot',
                    mocks: {
                        $t: jest.fn()
                    }
                })
                wrapper.vm.closeChat = jest.fn().mockImplementation(async () => {
                    await handleExtension(api.API_ON_CLOSE_BUTTON_CLICK);
                })

                //Mount Header component, and mock callback to parent TWC component
                const wrapperHeader = mount(Header, {
                    propsData: {
                        onClose: jest.fn().mockImplementation(async () => {
                            await wrapper.vm.closeChat();
                        }),
                        onMinimize: jest.fn().mockImplementation(async () => {
                            await wrapper.vm.minimizeChat();
                        }),
                    },
                    computed: {
                        showCloseButton: () => 'true' //mock .env variable to make CloseButton visible
                    },
                    mocks: {
                        $t: jest.fn()
                    }
                })

                //Simulate user click on the CloseButton, then MinimizeButton
                wrapperHeader.find('#header-close-button').trigger('click');
                await wrapper.vm.maximize();
                wrapperHeader.find('#header-minimize-button').trigger('click');


                //Remove event callback
                testWindow.TeneoWebChat.off(api.API_ON_CLOSE_BUTTON_CLICK);
                testWindow.TeneoWebChat.off(api.API_ON_MINIMIZE_BUTTON_CLICK);

                //Assert that the callback was called
                expect(onCloseButtonClickedCallbackSpy).toHaveBeenCalledTimes(1);
                expect(onMinimizeButtonClickedCallbackSpy).toHaveBeenCalledTimes(1);
            })
//*/

            test('API_ON_MODAL_CLICKED triggers callback', async () => {
                //Set a Spy on the callback
                const onModalButtonClickCallbackSpy = jest.spyOn(callbacks, 'onModalButtonClickCallback');

                //Mock developer defined API callback
                const myModalButtonClickCallback = function () {
                    callbacks.onModalButtonClickCallback();
                }
                testWindow.TeneoWebChat.on(api.API_ON_MODAL_BUTTON_CLICK, myModalButtonClickCallback);


                //Mount Component with a mock modal, and mocked onSelect
                const mockModal = {
                    type: "modal",
                    data: {
                        title: "Title",
                        text: "This is a modal text",
                        button_items: [
                            {
                                style: "primary",
                                title: "Primary",
                                postback: "modal-primary"
                            },]
                    }
                }
                const wrapper = mount(ModalMessage, {
                    propsData: {
                        message: mockModal
                    },
                    computed: {
                        imageUrl: () => jest.fn(),
                        altText: () => jest.fn(),
                        modalTitle: () => jest.fn(),
                        messageText: () => jest.fn(),
                        sanitizedHtmlText: () => jest.fn(),
                        buttonitems: () => mockModal.data.button_items //jest.fn(),
                    },
                })
                wrapper.vm.onSelect = jest.fn().mockImplementation(async (reply, idx) => {
                    await handleExtension(api.API_ON_MODAL_BUTTON_CLICK, reply);
                })

                //Simulate user click
                wrapper.findAll('a').at(0).trigger('click');

                //Remove event callback
                testWindow.TeneoWebChat.off(api.API_ON_MODAL_BUTTON_CLICK);

                //Assert that the callback was called
                expect(onModalButtonClickCallbackSpy).toHaveBeenCalledTimes(1);

            });
        })//End API tests


        describe('WebChat components can call API_ON_BUTTON_CLICK', () => {

            test('API_ON_BUTTON_CLICK triggers callback when ButtonMessage clicked', async () => {
                //Set a Spy on the callback

                const onButtonClickCallbackSpy = jest.spyOn(callbacks, 'onButtonClickCallback');

                //Mock developer defined API callbacks
                const myButtonClickCallback = function () {
                    callbacks.onButtonClickCallback();
                }
                testWindow.TeneoWebChat.on(api.API_ON_BUTTON_CLICK, myButtonClickCallback);

//TODO => Figure out why quickreply click is not calling function
                // const quickreplyMessage = {
                //     type: "quickreply",
                //     data: {
                //         quick_replies: [
                //             {
                //                 title: "One",
                //                 postback: "One"
                //             }
                //         ]
                //     }
                // }
                // const wrapperQuickReply = shallowMount(QuickreplyMessage, {
                //     propsData: {message: quickreplyMessage},
                // });
                //
                // wrapperQuickReply.find('a').trigger('click') //click a clickable list item
                // expect(onButtonClickCallbackSpy).toHaveBeenCalledTimes(1);
                // onButtonClickCallbackSpy.mockClear();


                //Mock message
                const mockMsg = {
                    type: "buttons",
                    data: {
                        title: "Optional title",
                        button_items: [
                            {
                                title: "Primary",
                                postback: "Primary"
                            },]
                    }
                }
                //Mount ButtonMessage
                const wrapperBtn = shallowMount(ButtonsMessage, {
                    propsData: {message: mockMsg},
                })

                //simulate click
                wrapperBtn.find('a').trigger('click')

                expect(onButtonClickCallbackSpy).toHaveBeenCalledTimes(1);
                onButtonClickCallbackSpy.mockClear();

                //Mock Card message
                const mockCardMsg = {
                    type: "card",
                    data: {
                        image: {
                            image_url: "https://url.to/an/image.png",
                            alt: "This is an image"
                        },
                        title: "Optional title",
                        subtitle: "This is a aubtitle",
                        button_items: [
                            {
                                style: "primary",
                                title: "Primary",
                                postback: "Primary"
                            }],
                        list_items: [{
                            title: "One",
                            postback: "One"
                        }],
                    }
                }
                const wrapperCard = shallowMount(CardMessage, {
                    propsData: {message: mockCardMsg},
                })

                wrapperCard.find('li').trigger('click') //click a card button
                wrapperCard.find('a').trigger('click') //click a clickable list item

                // Clean up callbacks
                // testWindow.TeneoWebChat.off(api.API_ON_BUTTON_CLICK);

                expect(onButtonClickCallbackSpy).toHaveBeenCalledTimes(2);
                onButtonClickCallbackSpy.mockClear();

                const clickableListCard = {
                    type: "clickablelist", data: {
                        title: "Optional title",
                        list_items: [{
                            title: "One",
                            postback: "One"
                        }]
                    }
                }

                const wrapperClickablelist = shallowMount(ClickablelistMessage, {
                    propsData: {message: clickableListCard},
                });

                wrapperClickablelist.find('li').trigger('click') //click a clickable list item

                expect(onButtonClickCallbackSpy).toHaveBeenCalledTimes(1);
                onButtonClickCallbackSpy.mockClear();


                //Clean up callbacks
                testWindow.TeneoWebChat.off(api.API_ON_BUTTON_CLICK);


            })//end test
        })//end describe

    }//end if

})