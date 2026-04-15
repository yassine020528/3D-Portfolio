import { useRef, useState } from 'react';

export default function useWindowManager(initialWindows) {
  const [windows, setWindows] = useState(initialWindows);
  const dragRef = useRef({ id: null, offsetX: 0, offsetY: 0 });
  const highestZRef = useRef(
    Math.max(...Object.values(initialWindows).map((windowState) => windowState.zIndex)),
  );

  const getNextZIndex = () => {
    highestZRef.current += 1;
    return highestZRef.current;
  };

  const openWindow = (id) => {
    const zIndex = getNextZIndex();

    setWindows((previous) => ({
      ...previous,
      [id]: {
        ...previous[id],
        isOpen: true,
        isMinimized: false,
        zIndex,
      },
    }));
  };

  const closeWindow = (id) => {
    setWindows((previous) => ({
      ...previous,
      [id]: {
        ...previous[id],
        isOpen: false,
        isMaximized: false,
      },
    }));
  };

  const focusWindow = (id) => {
    const zIndex = getNextZIndex();

    setWindows((previous) => ({
      ...previous,
      [id]: {
        ...previous[id],
        zIndex,
      },
    }));
  };

  const maximizeWindow = (id) => {
    focusWindow(id);

    setWindows((previous) => ({
      ...previous,
      [id]: {
        ...previous[id],
        isMaximized: !previous[id].isMaximized,
        isMinimized: false,
      },
    }));
  };

  const minimizeWindow = (id) => {
    setWindows((previous) => ({
      ...previous,
      [id]: {
        ...previous[id],
        isMinimized: true,
      },
    }));
  };

  const startDrag = (event, id) => {
    const windowState = windows[id];

    dragRef.current = {
      id,
      offsetX: event.clientX - windowState.x,
      offsetY: event.clientY - windowState.y,
    };

    focusWindow(id);
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current.id) {
      return;
    }

    const { id, offsetX, offsetY } = dragRef.current;

    setWindows((previous) => ({
      ...previous,
      [id]: {
        ...previous[id],
        x: event.clientX - offsetX,
        y: event.clientY - offsetY,
      },
    }));
  };

  const handlePointerUp = () => {
    dragRef.current = { id: null, offsetX: 0, offsetY: 0 };
  };

  return {
    windows,
    openWindow,
    closeWindow,
    focusWindow,
    maximizeWindow,
    minimizeWindow,
    startDrag,
    handlePointerMove,
    handlePointerUp,
  };
}
