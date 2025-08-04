import {Check, UserMinus} from "lucide-react";
import {useQuery} from "@rocicorp/zero/react";
import {cn} from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {
  getOrganizationMembersQuery,
  OrganizationMember,
} from "@/lib/zero-queries";
import {useZ} from "@/lib/zero-cache";
import {useAuthData} from "@/queries/session";
import UserAvatar from "@/components/user-avatar";

interface AssigneeComboboxProps {
  assignee: OrganizationMember | null;
  onAssigneeChange: (assigneeId: string | null) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export function AssigneeCombobox({
  assignee,
  onAssigneeChange,
  isOpen,
  onOpenChange,
  className,
}: AssigneeComboboxProps) {
  const userData = useAuthData();
  const z = useZ();
  const [members] = useQuery(
    getOrganizationMembersQuery(z, userData.activeOrganizationId),
  );

  const selectedMember = assignee
    ? members?.find((member) => member.user?.id === assignee.id)
    : null;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      <Popover open={isOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger
          aria-expanded={isOpen}
          role="combobox"
          className={cn(
            "justify-start gap-1 p-1 h-auto text-left font-normal",
            className,
          )}
          title="Assignee"
        >
          <div className="flex items-center gap-0.5">
            {selectedMember?.user ? (
              <UserAvatar
                name={selectedMember.user.name ?? ""}
                imageUrl={selectedMember.user.image ?? ""}
                className="w-5 h-5 shrink-0"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center">
                <UserMinus className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-[250px] p-0" align="end">
          <Command>
            <CommandInput placeholder="Search members..." className="h-9" />
            <CommandList>
              <CommandEmpty>No member found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="unassigned"
                  onSelect={() => {
                    onAssigneeChange(null);
                  }}
                >
                  <div className="flex items-center gap-1">
                    <div className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center">
                      <UserMinus className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span>Unassigned</span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      !selectedMember ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
                {members?.map((member) => (
                  <CommandItem
                    key={member.id}
                    value={member.id}
                    onSelect={() => {
                      if (member.user?.id !== assignee?.id) {
                        onAssigneeChange(member.user?.id ?? null);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <UserAvatar
                        name={member.user?.name ?? ""}
                        imageUrl={member.user?.image ?? ""}
                        className="w-5 h-5 shrink-0"
                      />
                      <span>{member.user?.name}</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedMember?.user?.id === member.user?.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
