import { sortEntries } from "../../utils";

const EntriesList = props => {
    const {state, setState} = props;

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
        let thisEntry = state.allEntries.find(a => a._id === id);
        setState({entry: thisEntry});
    }

    return (
        <div id="entries-list">
        <p>Entries</p>
        {getSortedEntries().map((a, i) => (
            <div onClick={() => handleClick(a.id)}>{a.content}</div>
        ))

        }
        </div>
    )
};

export default EntriesList;