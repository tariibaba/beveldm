import React, { Component, createRef } from 'react';
import { ipcRenderer } from 'electron';
import { loadState, updateDownloadsProgressPeriodically } from './thunks';
import './App.css';
import { ThemeProvider } from '@material-ui/styles';
import DownloadPage from './components/DownloadPage';
import { lightTheme, darkTheme } from './themes';
import { toggleDarkMode } from './actions';
import SettingsPage from './components/SettingsPage';
import { connect } from 'react-redux';
import { cleanUp } from './utilities';
import CustomSnackbar from './components/CustomSnackbar';
import { withStyles } from '@material-ui/core';

const styles = () => ({
  downloadPage: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  settingsPage: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: -1,
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false };
    this.downloadPage = createRef();
    this.settingsPage = createRef();
  }

  componentDidMount() {
    this.theme = this.props.reduxState.settings.theme;
    ipcRenderer.send('change-theme', this.theme);
    this.props.dispatch(loadState()).then(() => {
      this.setState({ loaded: true });
      this.page = this.props.reduxState.page;
      this.props.dispatch(updateDownloadsProgressPeriodically());
      ipcRenderer.send('react-loaded');
    });
    ipcRenderer.on('system-theme-changed', this.changeDarkMode.bind(this));
    ipcRenderer.on('before-close', this.saveState.bind(this));
  }

  componentDidUpdate(prevProps) {
    this.theme = this.props.reduxState.settings.theme;
    this.page = this.props.reduxState.page;
    if (prevProps.reduxState.settings.theme !== this.theme) {
      ipcRenderer.send('change-theme', this.theme);
    }
    if (prevProps.reduxState.page !== this.page) this.doPageTransition();
  }

  doPageTransition() {
    const keyFrames = [
      { opacity: 0, transform: 'translateY(5%)' },
      { opacity: 1, transform: 'translateY(0%)' },
    ];
    const options = { duration: 200, fill: 'forwards', easing: 'ease-out' };
    if (this.page === 'settings') {
      this.settingsPage.current.style.zIndex = 1300;
      this.settingsPage.current.animate(keyFrames, options);
    } else if (this.page === 'downloads') {
      this.settingsPage.current.animate(keyFrames, {
        ...options,
        direction: 'reverse',
      }).onfinish = () => (this.settingsPage.current.style.zIndex = -1);
    }
  }

  changeDarkMode(_event, isDarkMode) {
    const shouldToggleDarkMode =
      this.theme === 'dark' || (this.theme === 'system' && isDarkMode);
    this.props.dispatch(toggleDarkMode(shouldToggleDarkMode));
  }

  async saveState() {
    await cleanUp(this.props.reduxState);
    ipcRenderer.send('saved', null);
  }

  render() {
    return this.state.loaded ? (
      <ThemeProvider
        theme={this.props.reduxState.settings.darkMode ? darkTheme : lightTheme}
      >
        <div
          className={this.props.classes.downloadPage}
          ref={this.downloadPage}
        >
          <DownloadPage />
        </div>
        <div
          className={this.props.classes.settingsPage}
          ref={this.settingsPage}
        >
          <SettingsPage />
        </div>
        <CustomSnackbar />
      </ThemeProvider>
    ) : null;
  }
}

export default connect((state) => ({ reduxState: state }))(
  withStyles(styles)(App)
);
