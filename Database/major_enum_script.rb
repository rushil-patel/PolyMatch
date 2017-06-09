inputFile = File.new("majors.txt", "r")

list = []

while (line = inputFile.gets)
	list.push(line.chop)
end

sqlStatements = []
insert = ""

list.each do |major|
	insert = "INSERT\n" +
	 "INTO Majors (name)\n" +
	 "VALUES (#{major});\n\n"
	sqlStatements.push(insert)
end

File.open("./majorsInsert.sql", "w") do |file|
	sqlStatements.each do |query|
		file.puts(query)
	end
end

