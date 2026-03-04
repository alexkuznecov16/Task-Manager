import {
  DndContext,
  closestCorners,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core"
import { useState } from "react"
import Column from "./Column"
import { useBoard } from "../context/BoardContext"

const BOARD_ID = "main"

export default function Board() {
  const [activeTask, setActiveTask] = useState(null)
  const { columns, tasks, tags: userTags, addColumn, moveTask } = useBoard()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 180,
        tolerance: 6
      }
    })
  )

  function handleDragStart(event) {
    const taskId = event.active.data.current.taskId
    const task = tasks.find((t) => t.id === taskId)
    if (task) setActiveTask(task)
  }

  async function handleDragEnd(event) {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.data.current.taskId
    const newColumnId = over.data.current.columnId

    if (!taskId || !newColumnId) return

    const task = tasks.find((t) => t.id === taskId)

    if (!task) return
    if (task.column_id === newColumnId) return

    moveTask(taskId, newColumnId)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      <div className="board">
        {columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            tasks={tasks.filter((t) => t.column_id === col.id)}
            userTags={userTags}
          />
        ))}

        <button className="add-column" onClick={addColumn}>
          + Add Column
        </button>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="task dragging">
            <div className="drag-handle">⋮⋮</div>
            <div className="task-content">
              <span>{activeTask.title}</span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
