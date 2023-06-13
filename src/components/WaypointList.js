import { Box, Card, List, Typography } from "@mui/material";
import WaypointItem from "./WaypointItem";
import { useDispatch, useSelector } from "react-redux";
import { waypointsActions } from "../store/waypoints";
import Convertors from "../utils/Convertors";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
  restrictToFirstScrollableAncestor,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ConvertModuleWaypoints from "../utils/ConvertModuleWaypoints";

const WaypointList = () => {
  const isPending = useSelector((state) => state.ui.pendingWaypoint);
  const { lat, long, elev, module } = useSelector((state) => state.dcsPoint);
  const dcsWaypoints = useSelector((state) => state.waypoints.dcsWaypoints);
  const dispatch = useDispatch();

  const moduleCoordinates = ConvertModuleWaypoints(dcsWaypoints, module);
  const hasWaypoints = dcsWaypoints.length > 0;
  const saveWaypointHandler = () => {
    dispatch(
      waypointsActions.addDcsWaypoint({
        lat,
        long,
        elev,
      })
    );
  };
  const deleteHandler = (event, id) => {
    dispatch(waypointsActions.delete(id));
  };

  const renameHandler = (event, id) => {
    const name = event.target.value;
    if (name.length > 0) dispatch(waypointsActions.changeName({ id, name }));
  };

  const elevationHandler = (event, id) => {
    const elev = Convertors.fToM(event.target.value);
    dispatch(waypointsActions.changeElevation({ id, elev }));
  };

  const isTargetHandler = (event, id) => {
    const isTarget = event.target.checked;
    dispatch(waypointsActions.changeIsTarget({ id, isTarget }));
    console.log(dcsWaypoints);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      dispatch(
        waypointsActions.changeOrder({ active: active.id, over: over.id })
      );
    }
  };

  return (
    <Card sx={{ borderRadius: "10px", height: "100%" }}>
      <List
        style={{
          maxHeight: "100%",
          height: "100%",
          overflow: "auto",
          padding: 0,
        }}
      >
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[
            restrictToVerticalAxis,
            restrictToParentElement,
            restrictToFirstScrollableAncestor,
          ]}
        >
          <SortableContext
            items={moduleCoordinates}
            strategy={verticalListSortingStrategy}
          >
            {hasWaypoints || isPending ? (
              <>
                {moduleCoordinates.map((wp) => (
                  <WaypointItem
                    key={wp.id}
                    id={wp.id}
                    pending={false}
                    name={wp.name}
                    lat={wp.lat}
                    long={wp.long}
                    elev={wp.elev}
                    latHem={wp.latHem}
                    longHem={wp.longHem}
                    onRename={renameHandler}
                    onIsTarget={isTargetHandler}
                    onElevation={elevationHandler}
                    onDelete={deleteHandler}
                  />
                ))}

                {isPending && (
                  <WaypointItem
                    pending={true}
                    name={"New Waypoint"}
                    lat={null}
                    long={null}
                    elev={null}
                    latHem={null}
                    longHem={null}
                    onSave={saveWaypointHandler}
                  />
                )}
              </>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="overline"
                  color="grey"
                  style={{ "user-select": "none" }}
                >
                  No waypoints selected...
                </Typography>
              </Box>
            )}
          </SortableContext>
        </DndContext>
      </List>
    </Card>
  );
};

export default WaypointList;
