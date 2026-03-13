import 'react-native-gesture-handler/jestSetup';

require('react-native-reanimated').setUpTests();

jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));
