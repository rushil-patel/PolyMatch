inputFile = File.new("dormList.txt", "r")

list = []

while (line = inputFile.gets)
	list.push(line.chop)
end

sqlStatements = []
insert = ""

list.each do |dormName|
	insert = "INSERT\n" +
	 "INTO Dorms (name)\n" +
	 "VALUES (\'#{dormName}\');\n\n"
	sqlStatements.push(insert)
end

File.open("./dormInsert.sql", "w") do |file|
	sqlStatements.each do |query|
		file.puts(query)
	end
end

