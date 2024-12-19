require 'yaml'

module FastlaneHelpers

	HELPERS_DIR = __dir__

	JSON_STATE_FOLDER= "#{__dir__}/state"
	VERSION_INCREMENTED_MARKER = "#{FastlaneHelpers::JSON_STATE_FOLDER}/.version_incremented_marker"
	CURRENT_BRANCH = ENV['BUILD_SOURCEBRANCH'].sub "refs/heads/", ""
	DRY_RUN = ENV['DRY_RUN'] == 'true'

	BRANCH_IS_PRODUCTION = FastlaneHelpers::CURRENT_BRANCH == "master"
	BRANCH_IS_RC = FastlaneHelpers::CURRENT_BRANCH.start_with? 'rc/'

	PROD_PACKAGE_NAME = ENV['PACKAGE_ID']
	BETA_PACKAGE_NAME = "#{FastlaneHelpers::PROD_PACKAGE_NAME}"

	ANDROID_FLAVOR = ENV['FLAVOR']
	FIREBASE_APP_ANDROID = ENV['FIREBASE_APP_ANDROID']

	PATH = ENV['BUILD_PATH']
	AAB_PATH = "./app/build/outputs/bundle/#{PATH}"

	def self.get_build_postfix
		if FastlaneHelpers::BRANCH_IS_PRODUCTION then
			return ''
		end

		return FastlaneHelpers::BRANCH_IS_RC ? 'rc' : 'dev'
	end
	BUILD_POSTFIX = FastlaneHelpers.get_build_postfix

	def self.set_version_incremented
		File.open(FastlaneHelpers::VERSION_INCREMENTED_MARKER, "w") do |f|
			f.write('')
		end
	end

	def self.check_if_increment_needed
		already_incremented = File.exist? FastlaneHelpers::VERSION_INCREMENTED_MARKER
		return !(FastlaneHelpers::BRANCH_IS_PRODUCTION || already_incremented)
	end

end
