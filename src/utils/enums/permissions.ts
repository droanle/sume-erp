/** Enum representing various permissions within the system.
 *
 * The values of this enum define specific levels of access or capabilities
 * tied to particular functionalities or resources within an organization.
 *
 * Pattern:
 *  - "CREATE_ = create:": Grants permission to create a product.
 *  - "READ_ = read:": Grants permission to view or read a resource.
 *  - "UPDATE_ = update:": Grants permission to modify or update a resource.
 *  - "DELETE_ = delete:": Grants permission to remove or delete a resource.
 *
 * @example
 *  export enum Permission {
 *      CREATE_ = 'create:',
 *      READ_ = 'read:',
 *      UPDATE_ = 'update:',
 *      DELETE_ = 'delete:',
 *  }
 */
export enum Permission {
    CREATE_ = 'create:',
    READ_ = 'read:',
    UPDATE_ = 'update:',
    DELETE_ = 'delete:',
}


/**
 * Array containing all defined permission values.
 */
export const ALL_PERMISSIONS: Permission[] = Object.values(Permission);