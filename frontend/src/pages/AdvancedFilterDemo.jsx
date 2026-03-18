import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdvancedTableFilter } from "@/components/ui/advanced-table-filter";
import { useAdvancedFilter } from "@/hooks/useAdvancedFilter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Sample data
const sampleData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "student",
    status: "active",
    score: 85,
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "teacher",
    status: "active",
    score: 92,
    joinDate: "2024-02-20",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "student",
    status: "inactive",
    score: 78,
    joinDate: "2024-03-10",
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice@example.com",
    role: "admin",
    status: "active",
    score: 95,
    joinDate: "2024-01-05",
  },
];

export const AdvancedFilterDemo = () => {
  const filterConfig = [
    {
      id: "search",
      type: "search",
      searchFields: ["name", "email"],
    },
    {
      id: "role",
      type: "select",
      label: "Role",
      field: "role",
      options: [
        { value: "student", label: "Student" },
        { value: "teacher", label: "Teacher" },
        { value: "admin", label: "Admin" },
      ],
    },
    {
      id: "status",
      type: "select",
      label: "Status",
      field: "status",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
    {
      id: "dateRange",
      type: "date-range",
      label: "Join Date",
      field: "joinDate",
    },
    {
      id: "scoreRange",
      type: "number-range",
      label: "Score",
      field: "score",
    },
  ];

  const {
    filters,
    filteredData,
    handleFilterChange,
    handleClearFilters,
    activeFiltersCount,
  } = useAdvancedFilter(sampleData, filterConfig);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Advanced Table Filtering</h1>
          <p className="text-muted-foreground">
            Demo of the advanced filtering system
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Demo</CardTitle>
            <AdvancedTableFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              activeFiltersCount={activeFiltersCount}
              searchPlaceholder="Search by name or email..."
            />
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Join Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground">
                        No results found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {item.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.status === "active" ? "default" : "secondary"
                            }>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.score}</TableCell>
                        <TableCell>
                          {new Date(item.joinDate).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredData.length} of {sampleData.length} results
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✓ Search across multiple fields</li>
              <li>✓ Select dropdowns with "All" option</li>
              <li>✓ Date range filtering</li>
              <li>✓ Number range filtering</li>
              <li>✓ Active filter badges with quick remove</li>
              <li>✓ Filter count indicator</li>
              <li>✓ Clear all filters button</li>
              <li>✓ Responsive design</li>
              <li>✓ Real-time filtering</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
