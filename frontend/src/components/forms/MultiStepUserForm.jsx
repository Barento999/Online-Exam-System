import { useState } from "react";
import { MultiStepForm } from "./MultiStepForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DragDropUpload } from "@/components/ui/drag-drop-upload";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Lock,
  Settings,
  UserCheck,
  Upload,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Step 1: Basic Information
const BasicInfoStep = ({
  data,
  updateData,
  errors,
  fieldErrors,
  validationAttempted,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (password) => {
    updateData({ password });
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return "bg-red-500";
    if (passwordStrength < 50) return "bg-orange-500";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Weak";
    if (passwordStrength < 50) return "Fair";
    if (passwordStrength < 75) return "Good";
    return "Strong";
  };

  const getFieldError = (fieldName) => {
    return fieldErrors?.[fieldName] || null;
  };

  const hasFieldError = (fieldName) => {
    return (
      validationAttempted &&
      (fieldErrors?.[fieldName] || (!data[fieldName] && fieldName !== "phone"))
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={data.firstName || ""}
            onChange={(e) => updateData({ firstName: e.target.value })}
            placeholder="Enter first name"
            className={hasFieldError("firstName") ? "border-red-500" : ""}
          />
          {getFieldError("firstName") && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {getFieldError("firstName")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={data.lastName || ""}
            onChange={(e) => updateData({ lastName: e.target.value })}
            placeholder="Enter last name"
            className={hasFieldError("lastName") ? "border-red-500" : ""}
          />
          {getFieldError("lastName") && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {getFieldError("lastName")}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            value={data.email || ""}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="Enter email address"
            className={cn(
              "pl-10",
              hasFieldError("email") ? "border-red-500" : "",
            )}
          />
        </div>
        {getFieldError("email") && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {getFieldError("email")}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={data.password || ""}
            onChange={(e) => handlePasswordChange(e.target.value)}
            placeholder="Enter password"
            className={cn(
              "pl-10 pr-10",
              hasFieldError("password") ? "border-red-500" : "",
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>

        {getFieldError("password") && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {getFieldError("password")}
          </p>
        )}

        {data.password && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Password Strength:</span>
              <span
                className={cn(
                  "font-medium",
                  passwordStrength < 50
                    ? "text-red-600"
                    : passwordStrength < 75
                      ? "text-yellow-600"
                      : "text-green-600",
                )}>
                {getPasswordStrengthText()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all",
                  getPasswordStrengthColor(),
                )}
                style={{ width: `${passwordStrength}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Password should contain uppercase, lowercase, numbers, and special
              characters
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={data.phone || ""}
          onChange={(e) => updateData({ phone: e.target.value })}
          placeholder="Enter phone number"
        />
      </div>
    </div>
  );
};

// Step 2: Role and Permissions
const RolePermissionsStep = ({ data, updateData }) => {
  const roles = [
    {
      value: "student",
      label: "Student",
      description: "Can take exams and view results",
      permissions: ["take_exams", "view_results", "view_profile"],
    },
    {
      value: "teacher",
      label: "Teacher",
      description: "Can create exams, questions, and grade students",
      permissions: [
        "create_exams",
        "create_questions",
        "grade_exams",
        "view_students",
        "view_analytics",
      ],
    },
    {
      value: "admin",
      label: "Administrator",
      description: "Full system access and user management",
      permissions: [
        "full_access",
        "manage_users",
        "system_settings",
        "view_all_data",
      ],
    },
  ];

  const selectedRole = roles.find((role) => role.value === data.role);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>User Role *</Label>
        <div className="grid gap-4">
          {roles.map((role) => (
            <Card
              key={role.value}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                data.role === role.value
                  ? "ring-2 ring-primary bg-primary/5"
                  : "",
              )}
              onClick={() => updateData({ role: role.value })}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2 mt-1",
                      data.role === role.value
                        ? "bg-primary border-primary"
                        : "border-muted-foreground",
                    )}>
                    {data.role === role.value && (
                      <Check className="h-2 w-2 text-white m-0.5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{role.label}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {role.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {role.permissions.map((permission) => (
                        <Badge
                          key={permission}
                          variant="secondary"
                          className="text-xs">
                          {permission.replace(/_/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Account Settings</Label>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Account Status</h4>
            <p className="text-sm text-muted-foreground">
              Enable or disable user account access
            </p>
          </div>
          <Switch
            checked={data.status === "active"}
            onCheckedChange={(checked) =>
              updateData({ status: checked ? "active" : "inactive" })
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Email Verification Required</h4>
            <p className="text-sm text-muted-foreground">
              User must verify email before accessing account
            </p>
          </div>
          <Switch
            checked={data.requireEmailVerification || false}
            onCheckedChange={(checked) =>
              updateData({ requireEmailVerification: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Force Password Change</h4>
            <p className="text-sm text-muted-foreground">
              User must change password on first login
            </p>
          </div>
          <Switch
            checked={data.forcePasswordChange || false}
            onCheckedChange={(checked) =>
              updateData({ forcePasswordChange: checked })
            }
          />
        </div>
      </div>
    </div>
  );
};

// Step 3: Profile Information
const ProfileInfoStep = ({ data, updateData }) => {
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleAvatarSelect = (file) => {
    updateData({ avatar: file });
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleAvatarRemove = () => {
    updateData({ avatar: null });
    setAvatarPreview(null);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Avatar Upload Section */}
      <div className="space-y-4">
        <Label>Profile Picture</Label>
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarPreview} />
              <AvatarFallback className="text-lg">
                {getInitials(data.firstName, data.lastName)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1">
            <DragDropUpload
              onFileSelect={handleAvatarSelect}
              onFileRemove={handleAvatarRemove}
              accept="image/*"
              maxSize={5 * 1024 * 1024} // 5MB
              maxFiles={1}
              files={data.avatar ? [data.avatar] : []}
              showPreview={false}
              helperText="Upload a profile picture (JPG, PNG, GIF, WebP)"
              className="min-h-[120px]">
              <Camera className="h-8 w-8 mb-3 text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Drag & drop a profile picture here
                </p>
                <p className="text-xs text-muted-foreground">
                  Recommended: Square image, max 5MB
                </p>
              </div>
            </DragDropUpload>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select
            value={data.department || ""}
            onValueChange={(value) => updateData({ department: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="computer-science">Computer Science</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="physics">Physics</SelectItem>
              <SelectItem value="chemistry">Chemistry</SelectItem>
              <SelectItem value="biology">Biology</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="history">History</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentId">Student/Employee ID</Label>
          <Input
            id="studentId"
            value={data.studentId || ""}
            onChange={(e) => updateData({ studentId: e.target.value })}
            placeholder="Enter ID number"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio/Description</Label>
        <MarkdownEditor
          value={data.bio || ""}
          onChange={(value) => updateData({ bio: value })}
          placeholder="Enter a brief description about the user... (Markdown supported)"
          minHeight="120px"
          maxHeight="180px"
          label=""
          showPreview={true}
          showHelp={false}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={data.address || ""}
          onChange={(e) => updateData({ address: e.target.value })}
          placeholder="Enter address"
          rows={3}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={data.dateOfBirth || ""}
            onChange={(e) => updateData({ dateOfBirth: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergencyContact">Emergency Contact</Label>
          <Input
            id="emergencyContact"
            value={data.emergencyContact || ""}
            onChange={(e) => updateData({ emergencyContact: e.target.value })}
            placeholder="Emergency contact number"
          />
        </div>
      </div>
    </div>
  );
};

// Step 4: Review and Confirm
const ReviewStep = ({ data }) => {
  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const getRoleDescription = (role) => {
    const descriptions = {
      student: "Can take exams and view results",
      teacher: "Can create exams, questions, and grade students",
      admin: "Full system access and user management",
    };
    return descriptions[role] || "";
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Avatar className="h-20 w-20 mx-auto mb-4">
          <AvatarImage
            src={data.avatar ? URL.createObjectURL(data.avatar) : undefined}
          />
          <AvatarFallback className="text-lg">
            {getInitials(data.firstName, data.lastName)}
          </AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-semibold">
          {data.firstName} {data.lastName}
        </h3>
        <p className="text-muted-foreground">{data.email}</p>
        <Badge className="mt-2 capitalize">{data.role}</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span>
                {data.firstName} {data.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span>{data.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone:</span>
              <span>{data.phone || "Not provided"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Department:</span>
              <span>{data.department || "Not specified"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID:</span>
              <span>{data.studentId || "Not provided"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role:</span>
              <Badge variant="outline" className="capitalize">
                {data.role}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge
                variant={data.status === "active" ? "default" : "secondary"}>
                {data.status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email Verification:</span>
              <span>
                {data.requireEmailVerification ? "Required" : "Not required"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Password Change:</span>
              <span>
                {data.forcePasswordChange ? "Required" : "Not required"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            {getRoleDescription(data.role)}
          </p>
          {data.bio && (
            <div>
              <h4 className="font-medium mb-2">Bio:</h4>
              <p className="text-sm text-muted-foreground">{data.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-200">
              Ready to Create User
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Please review all information above. Once created, the user will
              receive an email with their login credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MultiStepUserForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const validateBasicInfo = (data) => {
    const errors = {};
    let isValid = true;

    // First Name validation
    if (!data.firstName || data.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters long";
      isValid = false;
    }

    // Last Name validation
    if (!data.lastName || data.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters long";
      isValid = false;
    }

    // Email validation
    if (!data.email) {
      errors.email = "Email address is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!data.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (data.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
      errors.password =
        "Password must contain uppercase, lowercase, and numbers";
      isValid = false;
    }

    return {
      isValid,
      fieldErrors: errors,
      message: isValid ? null : "Please fix the errors above to continue",
    };
  };

  const validateRolePermissions = (data) => {
    const errors = {};
    let isValid = true;

    if (!data.role) {
      errors.role = "Please select a user role";
      isValid = false;
    }

    return {
      isValid,
      fieldErrors: errors,
      message: isValid ? null : "Please select a role to continue",
    };
  };

  const steps = [
    {
      title: "Basic Information",
      description: "Enter the user's basic details and credentials",
      component: BasicInfoStep,
      validate: validateBasicInfo,
    },
    {
      title: "Role & Permissions",
      description: "Set user role and account permissions",
      component: RolePermissionsStep,
      validate: validateRolePermissions,
    },
    {
      title: "Profile Information",
      description: "Additional profile details and preferences",
      component: ProfileInfoStep,
      optional: true,
    },
    {
      title: "Review & Confirm",
      description: "Review all information before creating the user",
      component: ReviewStep,
    },
  ];

  const handleSubmit = async (formData) => {
    // Transform data for API
    const userData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      status: formData.status || "active",
      phone: formData.phone,
      department: formData.department,
      studentId: formData.studentId,
      bio: formData.bio,
      address: formData.address,
      dateOfBirth: formData.dateOfBirth,
      emergencyContact: formData.emergencyContact,
      requireEmailVerification: formData.requireEmailVerification,
      forcePasswordChange: formData.forcePasswordChange,
      avatar: formData.avatar,
    };

    await onSubmit(userData);
  };

  return (
    <MultiStepForm
      steps={steps}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      initialData={initialData}
      title="Create New User"
      subtitle="Follow the steps to create a comprehensive user profile"
      showProgress={true}
      showStepNumbers={true}
      validateOnStepChange={true}
      autoSave={true}
      autoSaveInterval={30000}
    />
  );
};
