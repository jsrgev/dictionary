import { sortEntries } from "../../utils";
import {useState, useEffect} from 'react';

const EntriesList = props => {
    const {state, setState, isDirty} = props;

    const [filterTerm, changeFilterTerm] = useState("");
    const [topArrowShown, setTopArrowShown] = useState(false);
    const [bottomArrowShown, setBottomArrowShown] = useState(false);

    useEffect(() => {
        displayArrows();
    }, []);

    const getSortedEntries = () => {
        let {id, letterOrder, diacriticOrder} = state.setup.scripts.items[0];
        const entrySet = state.allEntries.map(a => {
            let string = a.headword.morphs[0].scriptForms.find(a => a.refId === id).content;
            return {
                id: a._id,
                content: string
            };
        });
        return sortEntries(entrySet, letterOrder, diacriticOrder);
    };

    const displayArrows = () => {
        const ul = document.getElementById("entries-list");
        if (!ul) {
            return;
        }
        const pixels = 4;
        const isContentBelow = ul.scrollHeight - ul.scrollTop > ul.clientHeight + pixels;
        const isContentAbove = ul.scrollHeight - ul.scrollTop < ul.scrollHeight - pixels;
        if (isContentBelow) {
            setBottomArrowShown(true);
        } else {
            setBottomArrowShown(false);
        };
        if (isContentAbove) {
            setTopArrowShown(true);
        } else {
            setTopArrowShown(false);
        }
    };

    window.onresize = displayArrows;

    const getArrowClasses = () => {
        let classes  = [];
        if (topArrowShown) classes.push("top-arrow");
        if (bottomArrowShown) classes.push("bottom-arrow");
        return classes.join(" ");
    };

    const getWritingDirection = () => state.setup.scripts.items[0].writingDirection;

    const handleClick = (id) => {
        if (id === state.entry._id) {
            return;
        }
        if (isDirty()) {
            let response;
            if (state.entry._id) {
                response = window.confirm("Are you sure you want to open this entry? Changes to the current entry will not be saved.");
            } else {
                response = window.confirm("Are you sure you want to leave? The new entry will not be saved.");
            }
            if (!response) {
                return;
            }
        }
        let thisEntry = state.allEntries.find(a => a._id === id);
        setState({entry: thisEntry, entryCopy: thisEntry});
        setTimeout(() => {
            displayArrows();
        }, 10); ;
    }

    const isActive = id => id === state.entry._id;

    const filteredEntries = getSortedEntries().filter(a => {
        // exclude unicode combining diacritics block
        const entry = a.content.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace("‑", "-").toLowerCase();
        const term = filterTerm.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        return entry.includes(term);
    });

    const check = (e => {
        // console.log("hi");
        // const hoverItems = document.querySelectorAll( ":hover" );
        // console.log(hoverItems);
        // const clickedItem = hoverItems[hoverItems.length-1];
        // if (clickedItem === undefined || !clickedItem.closest(".palette")) {
            // return;
        // };
    });

    return (
        <div id="entries-list-section">
            <h2>Entries</h2>
            <input type="text" value={filterTerm} onChange={e => changeFilterTerm(e.target.value)} aria-label="Filter entries" placeholder="Filter entries..."/>
            <ul id="entries-list" onScroll={displayArrows} className={`for norm ${getArrowClasses()} ${getWritingDirection()}`} onClick={check}>
                {filteredEntries.map((a, i) => (
                    <li key={i} className={isActive(a.id) ? "active" : null} onClick={() => handleClick(a.id)}>{a.content}</li>
                ))

                }
            </ul>
        </div>
    )
};

export default EntriesList;