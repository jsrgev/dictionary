import {NavLink} from 'react-router-dom';
import {capitalize} from '../utils.js';

const NavBar = props => {
    const {languageData} = props;

    return (
        <nav>
        <ul>
            <li id="site-title">Geriadur</li>
            <li>
            {`${capitalize(languageData.targetLanguageName)}-${capitalize(languageData.sourceLanguageName)}`}
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