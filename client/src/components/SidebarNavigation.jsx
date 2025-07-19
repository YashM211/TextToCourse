// client/src/components/SidebarNavigation.jsx
import React from "react";
import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Link as RouterLink } from "react-router-dom"; // Use RouterLink for internal navigation

function SidebarNavigation({ drawerWidth }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar /> {/* Spacer for AppBar */}
      <Box sx={{ overflow: "auto" }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/my-courses">
              {" "}
              {/* Placeholder for My Courses */}
              <ListItemIcon>
                <LibraryBooksIcon />
              </ListItemIcon>
              <ListItemText primary="My Courses" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/">
              {" "}
              {/* Link back to home to generate new */}
              <ListItemIcon>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Generate New Course" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        {/* You can add more sections or dynamic content here later */}
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Text-to-Learn v1.0
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}

export default SidebarNavigation;
