import React, { useState } from 'react';
import Select from 'react-select';

export default ({ tags, selectedTags }) => {
  const [selectedOption, setSelectedOption] = useState(selectedTags);

  return (
    <Select
      name="tagIds"
      defaultValue={selectedOption}
      onChange={setSelectedOption}
      options={tags}
      isMulti
    />
  );
};
