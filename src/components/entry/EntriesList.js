import { sortEntries } from "../../utils";

const EntriesList = props => {
    const {state, setState, isDirty} = props;

    // console.log(state.allEntries[0].headword.morphs[0].content)

    const getSortedEntries = () => {
        const entrySet = state.allEntries.map(a => {
            return {
                id: a._id,
                content: a.headword.morphs[0].content
            };
        });
        return sortEntries(entrySet);
    };

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
    }

    const isActive = id => id === state.entry._id;

    return (
        <div className="entries-list-section">
            <p>Entries</p>
            <div className="entries-list">
                {getSortedEntries().map((a, i) => (
                    <div key={i} className={isActive(a.id) ? "active" : null} onClick={() => handleClick(a.id)}>{a.content}</div>
                ))

                }
            </div>
        </div>
    )
};

export default EntriesList;