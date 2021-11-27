import {NavLink} from 'react-router-dom';
import {capitalize} from '../utils.js';
import { languageData } from '../languageSettings.js';


const NavBar = () => {
    return (
        <nav>
        <ul>
            <li id="site-title">Geriadur</li>
            <li>
            {`${capitalize(languageData.languageName)}-English`}
            </li>
            <li><NavLink exact="true" to='/'>Word entry</NavLink></li>
            <li><NavLink exact="true" to='/setup'>Setup</NavLink></li>
            <li><NavLink exact="true" to='/dictionary'>Dictionary</NavLink></li>
            <li><NavLink exact="true" to='/about'>About</NavLink></li>
        </ul>
        </nav>
    )
}

export default NavBar;