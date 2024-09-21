type Permission = 'fileSystem' | 'network' | 'notifications';

export class PermissionManager {
  private pluginPermissions: Map<string, Set<Permission>> = new Map();

  grantPermission(pluginId: string, permission: Permission) {
    if (!this.pluginPermissions.has(pluginId)) {
      this.pluginPermissions.set(pluginId, new Set());
    }
    this.pluginPermissions.get(pluginId)!.add(permission);
  }

  hasPermission(pluginId: string, permission: Permission): boolean {
    return this.pluginPermissions.get(pluginId)?.has(permission) || false;
  }

  revokePermission(pluginId: string, permission: Permission) {
    this.pluginPermissions.get(pluginId)?.delete(permission);
  }
}

export const permissionManager = new PermissionManager();