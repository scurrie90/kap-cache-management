import React, { useState, useEffect } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import { fetchFilters } from "../network/network";
import Grid from "@material-ui/core/Grid";
import { List, ListItem } from "@material-ui/core";

const FilterByPattern: React.FC = () => {
  const [filterSelection, setFilterSelection] = useState<any>({});
  const [availablePatterns, setAvailablePatterns] = useState<any>({
    field0: ["Select a filter"],
  });
  const [activeFilter, setActiveFilter] = useState<number>(0);

  const handleFetchFilters = async (fieldNum: number) => {
    setActiveFilter(fieldNum);
    const data = await fetchFilters(fieldNum, filterSelection);
    setAvailablePatterns({ ...availablePatterns, [`field${fieldNum}`]: data });
  };

  useEffect(() => {
    console.log("FILTER SELECTION >>>", filterSelection);
    console.log("object keys", availablePatterns);
  }, [filterSelection]);

  return (
    <div className="filterPatterns">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <List>
            {Object.keys(availablePatterns).map((field, i) => (
              <ListItem
                button
                style={{ backgroundColor: "lightgrey" }}
                key={i}
                onClick={() => handleFetchFilters(i)}
              >
                {filterSelection?.[`field${i}`]
                  ? filterSelection?.[`field${i}`]
                  : field}
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setFilterSelection({});
              setAvailablePatterns({ field0: ["Select a filter"] });
            }}
          >
            Reset
          </Button>
        </Grid>
        <Grid item xs={6}>
          <List>
            {availablePatterns?.[`field${activeFilter}`]?.map((pattern, i) =>
              pattern ? (
                <ListItem
                  key={i}
                  button
                  onClick={() => {
                    setFilterSelection({
                      ...filterSelection,
                      [`field${activeFilter}`]: pattern,
                    });
                    setAvailablePatterns({
                      ...availablePatterns,
                      [`field${activeFilter + 1}`]: [
                        `field${activeFilter + 1}`,
                      ],
                    });
                  }}
                >
                  {pattern}
                </ListItem>
              ) : (
                <p>No other fields!</p>
              )
            )}
          </List>
        </Grid>
      </Grid>
    </div>
  );
};

export default FilterByPattern;
