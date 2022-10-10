const AddPopup = props => {
  const { popupItems, visible } = props;

  return (
    <div autoFocus={true} className={`add-popup${visible ? "" : " hidden"}`}>
      {popupItems.map((a, i) => (
        <div key={i} onClick={a[1]}>
          {a[0]}
        </div>
      ))}
    </div>
  );
};

export default AddPopup;
