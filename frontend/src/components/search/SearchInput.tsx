import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const SearchInput = ({
  onSearch,
  isLoading,
  className,
}: SearchInputProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex items-center gap-2", className)}
    >
      <Input
        type="text"
        placeholder="搜尋歌曲或藝人..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={isLoading}
        className="min-w-0 flex-1"
      />
      <Button
        type="submit"
        disabled={isLoading || !query.trim()}
        className="shrink-0 rounded-[20px] px-5"
      >
        {isLoading ? (
          <>
            <Spinner size="sm" />
            <span className="ml-2">搜尋中...</span>
          </>
        ) : (
          "搜尋"
        )}
      </Button>
    </form>
  );
};
