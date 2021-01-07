import { shallowMount, mount } from '@vue/test-utils';
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/jest-dom'
import { JSDOM } from 'jsdom'
import path from 'path'
import ejs from 'ejs'
import index from '../../src/index.js' //appears unused, but is required to access window.TeneoWebChat
import * as api  from '../../src/utils/api-function-names';
import * as constants from '../../src/utils/constants'

import TeneoWebChat from '@/components/../TeneoWebChat.vue'
import Header from '@/components/Header.vue'
import LaunchButton from '@/components/LaunchButton.vue'
import teneoApiPlugin from '../../src/plugins/teneo-api.js'

const index_js = path.resolve(__dirname, '../../src/index.js')

ejs.renderFile(index_js, function (err, str) {

    if (str) {
        let dom
        let container

        //Setup a Window for testing
        var testWindow;
        dom = new JSDOM(str);
        container = dom.window.document;
        testWindow = dom.window.globalThis;

        var mockStore = {
            state: {
              launchIconUrl: "",
              teneoEngineUrl: "",
              title: "Teneo Web Chat",
              titleIconUrl: "",
              visibility: "minimized",
            }
          }

        //Mount TWC Component
        const wrapperTeneoWebChat = mount(TeneoWebChat, {
            title: 'Teneo Web Chat',
            teneoEngineUrl: 'https://teneo-api.com/some-bot',
            propsData: {
                isChatOpen: false
            },
            mocks:{
                $store: mockStore,
                $t: jest.fn()
            },
        })


        describe('Tests CALL methods of Teneo API', () => {
            beforeEach(() => {
                dom = new JSDOM(str);
                container = dom.window.document
            })

            
            test('Assert API_CALL_MAXIMIZE', async () => {
        
                //Mock api method
                const maximizeMock = jest.fn();
                wrapperTeneoWebChat.vm.maximize = maximizeMock;

                //Make API method call
                await window.TeneoWebChat.call(api.API_CALL_MAXIMIZE);

                //Assert
                expect(maximizeMock).toHaveBeenCalledTimes(1);
            })

        
            test('Assert API_CALL_MINIMIZE', async () => {
                //Mock api method
                const minimizeMock = jest.fn();
                wrapperTeneoWebChat.vm.minimize = minimizeMock;

                //Make API method call
                await window.TeneoWebChat.call(api.API_CALL_MINIMIZE);

                //Assert
                expect(minimizeMock).toHaveBeenCalledTimes(1);
            })


            test('Assert API_CALL_SEND_INPUT', async() => {
                //Mock teneoApi's sendBaseMessageMethod at TeneoWebChat.vue
                const mockSendBaseMessage = jest.fn();
                wrapperTeneoWebChat.vm.sendBaseMessage = mockSendBaseMessage
                
                //Make API method call
                const mockMessage = {'text':'What do you think about jimi hendriks?', 'parameters': {'userCountryCode':'NL'}};
                await window.TeneoWebChat.call(api.API_CALL_SEND_INPUT, mockMessage, false);

                //Assert
                expect(mockSendBaseMessage).toHaveBeenCalledTimes(1);
            })


            test('Assert API_CALL_END_SESSION', async() => {
                //Mock methods at TeneoWebChat.vue
                const mockCloseSession = jest.fn();
                const mockClearHistory = jest.fn();
                wrapperTeneoWebChat.vm.closeSession = mockCloseSession
                wrapperTeneoWebChat.vm.clearHistory = mockClearHistory
                
                //Make API method calls
                await window.TeneoWebChat.call(api.API_CALL_END_SESSION);
                await window.TeneoWebChat.call(api.API_CALL_CLEAR_CHAT_HISTORY);

                //Assert
                expect(mockCloseSession).toHaveBeenCalledTimes(1);
                expect(mockClearHistory).toHaveBeenCalledTimes(1);
            })


            test('Assert API_CALL_RESET', async() => {

                //Mock methods at TeneoWebChat.vue
                const mockresetChat = jest.fn();
                wrapperTeneoWebChat.vm.resetChat = mockresetChat

                //Make API method calls
                await window.TeneoWebChat.call(api.API_CALL_RESET);        

                //Assert that the resetChat method has been called
                expect(mockresetChat).toHaveBeenCalledTimes(1);
            })


            test('Assert API_CALL_ADD_MESSAGE', async() => {
                /* Mock onMessage received method at TeneoWebChat.vue, which
                is the recipient of the ADD_MESSAGE event */
                const mockOnMessageReceived = jest.fn();
                wrapperTeneoWebChat.vm._onMessageReceived = mockOnMessageReceived
                
                //Make API method call
                const mockMessage = {'text':'What do you think about jimi hendriks?', 'parameters': {'userCountryCode':'NL'}};
                await window.TeneoWebChat.call(api.API_CALL_ADD_MESSAGE, mockMessage, false);

                //Assert
                expect(mockOnMessageReceived).toHaveBeenCalledTimes(1);
            })


            test('Assert API_CALL_SET_CHAT_WINDOW_TITLE', async()=> {
                //Mount component with mock store
                const wrapperHeader = mount(Header, {
                    propsData: {
                        onClose: jest.fn(),
                        onMinimize: jest.fn()
                    },
                    mocks:{
                        $store: mockStore,
                        $t: jest.fn()
                    }
                })

                //Mock the implementation of setTitle in 'window.TeneoWebChat'
                const newTitle = 'New Title';

                //backup method group, then overwrite with mock
                const callBK = window.TeneoWebChat.call
                window.TeneoWebChat.call = jest.fn().mockImplementation((function_name, payload) => {   
                    switch  (function_name) {
                        case api.API_CALL_SET_CHAT_WINDOW_TITLE:
                            // TODO: throw error if payload is invalid or if store throws error
                            if (typeof payload === "string") {
                                mockStore.state.title = payload;
                            }
                            break
                    }
                  });
                //Call the API method under test
                await window.TeneoWebChat.call(api.API_CALL_SET_CHAT_WINDOW_TITLE, newTitle);
                window.TeneoWebChat.call = callBK

                //Asert that that the value was set in the Header's template
                expect(wrapperHeader.html()).toContain('New Title');
            })

            test('Assert API_CALL_RESET_CHAT_WINDOW_TITLE', async()=> {
                //Mount component with mock store
                const wrapperHeader = mount(Header, {
                    propsData: {
                        onClose: jest.fn(),
                        onMinimize: jest.fn()
                    },
                    mocks:{
                        $store: mockStore,
                        $t: jest.fn()
                    }
                })

                //Mock the method's mplementation in 'window.TeneoWebChat'

                //backup method group, then overwrite with mock
                const callBK = window.TeneoWebChat.call
                window.TeneoWebChat.call = jest.fn().mockImplementation((function_name) => {   
                    switch  (function_name) {
                        case api.API_CALL_RESET_CHAT_WINDOW_TITLE:
                            mockStore.state.title = constants.DEFAULT_TITLE;
                            break
                    }
                  });
                //Call the API method under test
                await window.TeneoWebChat.call(api.API_CALL_RESET_CHAT_WINDOW_TITLE);
                window.TeneoWebChat.call = callBK

                //Asert that that the value was set in the Header's template
                expect(wrapperHeader.html()).toContain(constants.DEFAULT_TITLE);
            })

            test('Assert API_CALL_SET_CHAT_WINDOW_ICON', async()=> {
                //Mount component with mock store
                const wrapperHeader = mount(Header, {
                    propsData: {
                        onClose: jest.fn(),
                        onMinimize: jest.fn()
                    },
                    mocks:{
                        $store: mockStore,
                        $t: jest.fn()
                    }
                })

                //Mock the method's mplementation in 'window.TeneoWebChat'
                const newIconUrl = 'www.icon.url';

                //backup method group, then overwrite with mock
                const callBK = window.TeneoWebChat.call
                window.TeneoWebChat.call = jest.fn().mockImplementation((function_name, payload) => {   
                    switch  (function_name) {
                        case api.API_CALL_SET_CHAT_WINDOW_ICON:
                            // TODO: throw error if payload is invalid or if store throws error
                            if (typeof payload === "string") {
                                mockStore.state.titleIconUrl = payload;
                            }
                            break
                    }
                  });
                //Call the API method under test
                await window.TeneoWebChat.call(api.API_CALL_SET_CHAT_WINDOW_ICON, newIconUrl);
                window.TeneoWebChat.call = callBK

                //Asert that that the value was set in the Header's template
                expect(wrapperHeader.html()).toContain('www.icon.url');
            })

            test('Assert API_CALL_RESET_CHAT_WINDOW_ICON', async()=> {
                //Mount component with mock store
                const wrapperHeader = mount(Header, {
                    propsData: {
                        onClose: jest.fn(),
                        onMinimize: jest.fn()
                    },
                    mocks:{
                        $store: mockStore,
                        $t: jest.fn()
                    }
                })

                //Mock the method's mplementation in 'window.TeneoWebChat'
                //backup method group, then overwrite with mock
                const callBK = window.TeneoWebChat.call
                window.TeneoWebChat.call = jest.fn().mockImplementation((function_name, payload) => {   
                    switch  (function_name) {
                        case api.API_CALL_RESET_CHAT_WINDOW_ICON:
                            mockStore.state.titleIconUrl = null;
                            break
                    }
                  });
                //Call the API method under test
                await window.TeneoWebChat.call(api.API_CALL_RESET_CHAT_WINDOW_ICON);
                window.TeneoWebChat.call = callBK

                //Asert that that the default icon's id exists in the Header's template
                expect(wrapperHeader.html()).toContain('default-header-icon');
            })

            test('Assert LaunchButton methods API_CALL_SET_LAUNCH_ICON and API_CALL_RESET_LAUNCH_ICON', async()=> {
                //Mount component with mock store
                const wrapperLaunchButton = mount(LaunchButton, {
                    propsData: {
                        open: jest.fn(),
                        isOpen: false
                    },
                    mocks:{
                        $store: mockStore,
                        $t: jest.fn()
                    }
                })

                //Mock the method's mplementation in 'window.TeneoWebChat'
                const newIconUrl = 'www.launch-icon.url';

                //backup method group, then overwrite with mock
                const callBK = window.TeneoWebChat.call
                window.TeneoWebChat.call = jest.fn().mockImplementation((function_name, payload) => {
                    switch  (function_name) {
                        case api.API_CALL_SET_LAUNCH_ICON:
                            // TODO: throw error if payload is invalid or if store throws error
                            if (typeof payload === "string") {
                                mockStore.state.launchIconUrl = payload;
                            }
                            break
                        
                        case api.API_CALL_RESET_LAUNCH_ICON:
                            mockStore.state.launchIconUrl = null;
                            break
                    }
                  });
                //Call the API method under test
                await window.TeneoWebChat.call(api.API_CALL_SET_LAUNCH_ICON, newIconUrl);
                

                //Asert that that the value was set in the component's template
                expect(wrapperLaunchButton.html()).toContain('www.launch-icon.url');


                //Call the second API method under test
                await window.TeneoWebChat.call(api.API_CALL_RESET_LAUNCH_ICON);

                //Rollback mocks
                window.TeneoWebChat.call = callBK

                //Asert that that the value was resset in the component's template
                expect(wrapperLaunchButton.html()).toContain('default-launch-button-icon');
            })

            test('Assert API_GET_STATE', async ()=> {     

                //backup method group, then overwrite with mock
                const getBK = window.TeneoWebChat.get
                window.TeneoWebChat.get = jest.fn().mockImplementation((function_name) => {
                    switch (function_name) {
                      case api.API_GET_STATE:  
                         return {'visibility':mockStore.state.visibility}
                    }
                });
                
                //Simulate calling Api method
                const expected = {'visibility' : 'minimized'};
                const actual = await window.TeneoWebChat.get(api.API_GET_STATE);

                //roll back the mock
                window.TeneoWebChat.get = getBK;

                expect(actual).toEqual(expected);
            });

            test('Assert API_GET_CHAT_HISTORY', async ()=> {  
                
                //backup method group, then overwrite with mock
                const getBK = window.TeneoWebChat.get
                window.TeneoWebChat.get = jest.fn().mockImplementation((function_name) => {
                    switch(function_name) {
                        case api.API_GET_CHAT_HISTORY:
                            return [{"author":"bot","type":"text","data":{"text":"Good afternoon and welcome! This is a test message."}}]
                    }
                });

                //Simulate calling Api method
                const chatHistory = await window.TeneoWebChat.get(api.API_GET_CHAT_HISTORY);

                //roll back the mock
                window.TeneoWebChat.get = getBK;

                expect(chatHistory.length).toBe(1);
                expect(chatHistory[0].author).toBe("bot");
                expect(chatHistory[0].type).toBe("text");
            });
        })//end describe
    } //end if
})