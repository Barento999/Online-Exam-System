import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

/**
 * Responsive table that shows cards on mobile and table on desktop
 */
export const ResponsiveTable = ({
  data,
  columns,
  renderActions,
  onRowSelect,
  isRowSelected,
  className = "",
}) => {
  return (
    <>
      {/* Desktop Table View */}
      <div className={cn("hidden md:block", className)}>{data}</div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No items found
          </div>
        ) : (
          data.map((item, index) => (
            <Card key={item._id || index}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Checkbox for selection */}
                  {onRowSelect && (
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <Checkbox
                        checked={isRowSelected(item._id)}
                        onCheckedChange={() => onRowSelect(item._id)}
                        aria-label={`Select item ${index + 1}`}
                      />
                      <span className="text-sm text-muted-foreground">
                        Select
                      </span>
                    </div>
                  )}

                  {/* Render each column as a row */}
                  {columns.map((column) => (
                    <div key={column.key} className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        {column.label}:
                      </span>
                      <span className="text-sm font-medium text-right">
                        {column.render ? column.render(item) : item[column.key]}
                      </span>
                    </div>
                  ))}

                  {/* Actions */}
                  {renderActions && (
                    <div className="pt-2 border-t flex justify-end gap-2">
                      {renderActions(item)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
};
