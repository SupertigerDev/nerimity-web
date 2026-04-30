/* @refresh reload */
import { render } from '@solidjs/web';
import './index.css'
import { AppRouter } from './AppRouter';

const root = document.getElementById('root')

render(() => <AppRouter />, root!)
