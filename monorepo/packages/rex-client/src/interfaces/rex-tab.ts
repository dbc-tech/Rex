export interface RexFieldSettings {
  display_as: string
}

export interface RexFieldType {
  id: string
  text: string
}

export interface RexField {
  id: string
  account_id: string
  group_id: string
  label: string
  options: unknown
  settings: RexFieldSettings
  module_name: string
  is_privilege_locked: unknown
  priority: number
  is_hidden: unknown
  field_type: RexFieldType
}

export interface RexGroup {
  id: string
  account_id: string
  tab_id: string
  core_tab_id: unknown
  label: string
  help_text: string
  module_name: string
  is_privilege_locked: unknown
  priority: number
  priority_type: string
  priority_core_group_id: unknown
  limit_to_category_ids: string[]
  is_hidden: unknown
  fields: RexField[]
}

export interface RexTab {
  id: string
  account_id: string
  label: string
  module_name: string
  is_privilege_locked: unknown
  priority: number
  is_hidden: unknown
  groups: RexGroup[]
  library: unknown
}

export interface RexTabResult {
  tabs: RexTab[]
  groups_on_core_tabs: unknown[]
  non_interactive_fields: unknown[]
}
