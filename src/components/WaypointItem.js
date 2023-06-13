import {
  Button,
  IconButton,
  ListItem,
  ListItemText,
  Stack,
  Grid,
  TextField,
  Input,
  Box,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DragHandle,
  ArrowDropDown,
  ArrowDropUp,
  Delete,
} from "@mui/icons-material";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import "./WaypointItem.css";

const { ipcRenderer } = window.require("electron");

const WaypointItem = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleInputFocus = () => {
    ipcRenderer.send("focus");
  };
  const handleInputDefocus = (event) => {
    ipcRenderer.send("defocus");
    event.target.blur();
  };
  const handleInputFinished = (event) => {
    if (event.key === "Enter") {
      handleExpand();
      handleInputDefocus();
    }
  };

  return (
    <ListItem ref={setNodeRef} style={style} {...attributes}>
      <Grid container>
        <Grid item xs={7}>
          {isExpanded ? (
            <Stack>
              <TextField
                size="small"
                defaultValue={props.name}
                onChange={(e) => props.onRename(e, props.id)}
                onMouseEnter={handleInputFocus}
                onMouseLeave={handleInputDefocus}
                onKeyDown={handleInputFinished}
              ></TextField>

              <Box sx={{ mx: 0.5 }}>
                <Grid container spacing={3}>
                  <Grid item xs={3}>
                    <Typography variant="overline" color="grey">
                      LAT
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Input
                      disabled
                      value={props.latHem + " " + props.lat}
                    ></Input>
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={3}>
                    <Typography variant="overline" color="grey">
                      LONG
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Input
                      disabled
                      value={props.longHem + " " + props.long}
                    ></Input>
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={3}>
                    <Typography variant="overline" color="grey">
                      ELEV
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Input
                      value={props.elev}
                      onChange={(e) => props.onElevation(e, props.id)}
                      onMouseEnter={handleInputFocus}
                      onMouseLeave={handleInputDefocus}
                      onKeyDown={handleInputFinished}
                    ></Input>
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={3}>
                    <input 
                      type="checkbox"
                       
                      onChange={(e) => props.onIsTarget(e, props.id)}>

                      </input>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="overline" color="grey">
                      isTarget F15E
                    </Typography>
                  </Grid>
                  
                </Grid>
              </Box>
            </Stack>
          ) : (
            <ListItemText>{props.name}</ListItemText>
          )}
        </Grid>
        <Grid item xs={5}>
          {props.pending ? (
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Tooltip title="Save waypoint">
                <Button variant="contained" onClick={props.onSave}>
                  Save
                </Button>
              </Tooltip>
            </Stack>
          ) : (
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              <IconButton onClick={(e) => props.onDelete(e, props.id)}>
                <Delete />
              </IconButton>
              <IconButton onClick={handleExpand}>
                {isExpanded ? <ArrowDropUp /> : <ArrowDropDown />}
              </IconButton>
              <Box className="dragHandle" {...listeners}>
                <DragHandle />
              </Box>
            </Stack>
          )}
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default WaypointItem;
