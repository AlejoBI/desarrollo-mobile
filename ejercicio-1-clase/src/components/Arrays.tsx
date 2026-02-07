const Arrays = () => {
  const myArray: String[] = ["Elemento 1", "Elemento 2", "Elemento 3"];
  return (
    <>
      <ol>
        {myArray.map((element, index) => (
          <li key={index}>{element}</li>
        ))}
      </ol>
    </>
  );
};

export default Arrays;
